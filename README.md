# Duet XYZ Probe Panel

A [Duet Web Control](https://github.com/Duet3D/DuetWebControl) plugin that adds an on-screen XYZ touch-probe panel — corner probing and individual X/Y/Z axis probing against a touch plate, with configurable plate dimensions, endmill diameter, offsets and feedrate.

> ⚠️ **Pre-release — use with caution.** This plugin has only had limited testing on real hardware. Before relying on it for a real job, verify your probe wiring/configuration and watch the first few probing moves closely so you can hit emergency stop if anything looks wrong.

## Why this exists

Ooznest's stock firmware/control panel for the WorkBee CNC includes a built-in XYZ touch-probe panel. If you move to vanilla RepRapFirmware + Duet Web Control (e.g. running a Duet 3 board instead of Ooznest's stock controller), that convenience disappears — there's no equivalent panel out of the box. This plugin brings that functionality back as a DWC plugin, usable on any vanilla RRF/DWC setup, not just Ooznest machines.

## Requirements

- Duet Web Control **3.6** or newer
- RepRapFirmware **3.3** or newer
- A touch probe configured in RepRapFirmware as probe index 0 (`M558 ... P0`)

## Installation

1. Download the latest `ProbePanel-*.zip` from the [Releases page](../../releases).
2. In DWC, open **Settings** and use the plugin installer (the "Install Plugin" upload option) to select the downloaded zip.
3. Once installed, start the plugin — it appears in the left-hand navigation as **XYZ Probe**.

On first launch, the plugin automatically deploys its macro files to `0:/macros/ProbePanel/` on the SD card.

## Usage

**Main controls:**
- **Endmill Diameter** — diameter of the bit currently in the spindle. Used to compensate the probed position for the bit's radius.
- **Probe Location** — which corner of the touch plate you're probing against (Front Left / Front Right / Back Left / Back Right).
- **Probe Corner** — probes Z, then X, then Y at the selected corner in one pass, and sets the work coordinate system (WCS) origin.
- **X / Y / Z buttons** — probe a single axis only, useful for re-zeroing one axis without repeating the full corner sequence.

**Touch Probe Settings** (collapsible section):
- **Feedrate** — probing speed (mm/min).
- **Plate Thickness / Z Dimension** — thickness of your touch plate, since Z-probing touches its top face rather than the true stock surface.
- **X / Y / Z-Axis Offset** — distance from the plate's reference edges to your actual workpiece zero. The plate is assumed to sit flush against the corner being probed, so X/Y zero is simply `offset + endmill radius` from the probed edge — no plate footprint size needed for that math.

**Reset to Defaults** resets these settings fields back to their built-in defaults. It does **not** touch the macro files on the SD card.

**Restore Macros** re-deploys the default macro files, overwriting any edits you've made directly on the machine. Use it if you've customized a macro and want to get back to a known-good state.

## Dynamic macros — edit freely, no rewriting needed

The actual probing logic lives in plain RepRapFirmware G-code macro files on the SD card (`0:/macros/ProbePanel/probe-corner.g`, `probe-x.g`, `probe-y.g`, `probe-z.g`). You're free to open and edit these directly — add moves, change the probe order, tune retract distances, whatever you need.

What makes them "dynamic" is that the numeric values from the panel (endmill diameter, plate dimensions, offsets, feedrate, selected corner) are **not hardcoded** into the macro files. Instead, every time you press a button, the plugin sends the macro call with your current panel settings as parameters (e.g. `M98 P"probe-corner.g" A"FL" B6.3500 ...`), and the macro reads them via RRF's `param.*` syntax. That means changing a setting in the panel (say, switching from a 6mm to a 3mm endmill between jobs) takes effect immediately on your very next probe — no macro rewrite or redeploy required.

The one thing to be careful of: if you edit a macro and replace one of the `param.*` references with a fixed number, that panel field will silently stop having any effect on that macro. Each macro file has a comment block at the top listing which `param.*` variables it uses and what they mean.

## For developers

The macro files aren't hand-maintained on the SD card as the source of truth — they're generated from templates in **[`macros.js`](./macros.js)**. If you want to change the probing logic that ships with the plugin (as opposed to just editing your own already-deployed copy), edit the G-code template strings in that file.

Each template documents its own parameters, but for reference:

| Parameter | Meaning |
|---|---|
| `param.A` | Corner (`"FL"` \| `"FR"` \| `"BL"` \| `"BR"`) |
| `param.B` | Endmill Diameter (mm) |
| `param.C` | Plate Thickness / Z Dimension (mm) |
| `param.D` | X-Axis Offset (mm) |
| `param.E` | Y-Axis Offset (mm) |
| `param.F` | Z-Axis Offset (mm) |
| `param.G` | Feedrate (mm/min) |

### Building a release zip

This is a Vue component (`ProbePanel.vue`) that has to be compiled into a loadable DWC plugin chunk — it can't just be zipped as source. Building requires a checkout of the main [DuetWebControl](https://github.com/Duet3D/DuetWebControl) repository, since that's what provides the build tooling:

1. Copy this repo's files (`plugin.json`, `ProbePanel.vue`, `index.js`, `macros.js`) into `src/plugins/ProbePanel/` inside a DuetWebControl checkout, overwriting what's there.
2. From inside that checkout, run:
   ```
   npm run build-plugin ProbePanel
   ```
3. This runs a full DWC build and produces `dist/ProbePanel-<version>.zip` — the file to attach to a GitHub release.

## License

[GNU General Public License v3.0](./LICENSE) — same license as DuetWebControl itself.
