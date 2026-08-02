'use strict'

const PARAM_DOC = `\
; param.A  X direction sign (+1 or -1) — which way "into the stock" is for this corner
; param.B  Y direction sign (+1 or -1)
; param.C  X probe trigger direction (M585 S value: 0 or 1)
; param.D  Y probe trigger direction (M585 S value: 0 or 1)
; param.E  Endmill Diameter (mm)
; param.F  Plate Thickness (mm)
; param.G  X-Axis Offset (mm, corner-adjusted)
; param.H  Y-Axis Offset (mm, corner-adjusted)
; param.I  Plate X Dimension (mm, corner-adjusted)
; param.J  Plate Y Dimension (mm, corner-adjusted)
; param.K  Feedrate (mm/min)`

export const PROBE_CORNER = `\
; probe-corner.g — XYZ corner probe for touch plate
; Part of the ProbePanel DWC plugin.
;
; This file is yours to customize. Just leave the param.* variables below
; alone: they're filled in automatically from the Probe Panel screen every
; time you press a button. If you replace one with a fixed number, that
; field on the panel will stop having any effect on this macro.
;
${PARAM_DOC}

G91

; Move from the jogged start position to the plate's center and probe Z
G1 Z5 F{param.K}
G1 X{(param.I / 2 - param.G) * param.A} Y{(param.J / 2 - param.H) * param.B} F{param.K}
M585 Z10 F{param.K} P0 S1
G10 L20 Z{param.F}
G1 Z5 F{param.K}

; Move past the X edge, drop to plate-side height, probe inward
G1 X{(param.I / 2 + 5 + param.E / 2) * param.A * -1} F{param.K}
G1 Z{-5 - param.F / 2} F{param.K}
M585 X10 F{param.K} P0 S{param.C}
G10 L20 X{(param.G + param.E / 2) * -1 * param.A}
G1 X{-5 * param.A} F{param.K}
G1 Z{5 + param.F / 2} F{param.K}

; Move past the Y edge, drop to plate-side height, probe inward
G1 X{(5 + param.I / 2) * param.A} Y{(param.J / 2 + 5 + param.E / 2) * param.B * -1} F{param.K}
G1 Z{-5 - param.F / 2} F{param.K}
M585 Y10 F{param.K} P0 S{param.D}
G10 L20 Y{(param.H + param.E / 2) * -1 * param.B}
G1 Y{-5 * param.B} F{param.K}
G1 Z{5 + param.F / 2} F{param.K}

; Return to the newly-set zero
G1 X{(param.I / 2 - param.G) * param.A * -1} F{param.K}
G90
G1 X0 Y0 F{param.K}
`

export const PROBE_X = `\
; probe-x.g — X-only probe for touch plate
; Part of the ProbePanel DWC plugin.
;
; This file is yours to customize. Just leave the param.* variables below
; alone: they're filled in automatically from the Probe Panel screen every
; time you press a button. If you replace one with a fixed number, that
; field on the panel will stop having any effect on this macro.
;
${PARAM_DOC}

G91

G1 Z5 F{param.K}
G1 X{(param.I / 2 - param.G) * param.A} Y{(param.J / 2 - param.H) * param.B} F{param.K}
G1 X{(param.I / 2 + 5 + param.E / 2) * param.A * -1} F{param.K}
G1 Z{-5 - param.F / 2} F{param.K}
M585 X10 F{param.K} P0 S{param.C}
G10 L20 X{(param.G + param.E / 2) * -1 * param.A}
G1 X{-5 * param.A} F{param.K}
G1 Z{5 + param.F / 2} F{param.K}
G1 Y{(param.J / 2 - param.H) * param.B * -1} F{param.K}

G90
G1 X0 F{param.K}
`

export const PROBE_Y = `\
; probe-y.g — Y-only probe for touch plate
; Part of the ProbePanel DWC plugin.
;
; This file is yours to customize. Just leave the param.* variables below
; alone: they're filled in automatically from the Probe Panel screen every
; time you press a button. If you replace one with a fixed number, that
; field on the panel will stop having any effect on this macro.
;
${PARAM_DOC}

G91

G1 Z5 F{param.K}
G1 X{(param.I / 2 - param.G) * param.A} Y{(param.J / 2 - param.H) * param.B} F{param.K}
G1 Y{(param.J / 2 + 5 + param.E / 2) * param.B * -1} F{param.K}
G1 Z{-5 - param.F / 2} F{param.K}
M585 Y10 F{param.K} P0 S{param.D}
G10 L20 Y{(param.H + param.E / 2) * -1 * param.B}
G1 Y{-5 * param.B} F{param.K}
G1 Z{5 + param.F / 2} F{param.K}
G1 X{(param.I / 2 - param.G) * param.A * -1} F{param.K}

G90
G1 Y0 F{param.K}
`

export const PROBE_Z = `\
; probe-z.g — Z-only probe for touch plate
; Part of the ProbePanel DWC plugin.
;
; This file is yours to customize. Just leave the param.* variables below
; alone: they're filled in automatically from the Probe Panel screen every
; time you press a button. If you replace one with a fixed number, that
; field on the panel will stop having any effect on this macro.
;
; param.F  Plate Thickness (mm)
; param.K  Feedrate (mm/min)
;
; Probes straight down wherever the machine currently is — use this to
; re-check Z without repeating a full corner probe.

G91
M585 Z-10 F{param.K} P0 S1
G10 L20 Z{param.F}
G1 Z5 F{param.K}
G90
`

export const MACROS = {
    'probe-corner.g': PROBE_CORNER,
    'probe-x.g':      PROBE_X,
    'probe-y.g':      PROBE_Y,
    'probe-z.g':      PROBE_Z,
}
