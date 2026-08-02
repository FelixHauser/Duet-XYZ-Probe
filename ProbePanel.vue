<template>
	<v-container fluid class="pa-2">

		<!-- ── Main Control Card ───────────────────────────────────────────── -->
		<v-card outlined class="mb-3">
			<v-card-text class="pa-4">

				<!-- Title row -->
				<div class="d-flex align-center mb-8">
					<v-icon class="mr-2" color="orange darken-1">mdi-crosshairs-gps</v-icon>
					<span class="subtitle-1 font-weight-medium">XYZ Probe Control</span>
					<v-spacer />
					<span class="body-2">
						Probe Status:&nbsp;
						<span :class="probeTriggered ? 'orange--text text--darken-1 font-weight-bold' : 'grey--text'">
							{{ probeTriggered ? 'Triggered' : 'Not Triggered' }}
						</span>
					</span>
					<v-spacer />
				</div>

				<!-- Controls row: [endmill] [dropdown / Probe Corner] [XY / Z] -->
				<div class="d-flex align-start probe-controls-row">

					<!-- Left: endmill diameter -->
					<div class="probe-left-col d-flex align-start">
						<v-text-field
							:value="endmillDia"
							label="Endmill Diameter (mm)"
							type="number"
							hide-details
							step="0.001"
							min="0"
							@change="saveSetting('endmillDia', $event)"
						/>
					</div>

					<!-- Middle: corner dropdown + Probe Corner button -->
					<div class="d-flex flex-column flex-grow-1 probe-mid-col">
						<v-select
							v-model="selectedCorner"
							:items="cornerOptions"
							label="Probe Location"
							outlined
							dense
							hide-details
							class="mb-2"
						/>
						<v-btn
							color="orange darken-1"
							dark
							block
							:disabled="buttonsDisabled"
							:loading="probingOp === 'corner'"
							@click="probeCorner"
						>
							Probe Corner
						</v-btn>
					</div>

					<!-- Right: →X ↑Y (top) / ↓Z full-width (bottom) -->
					<div class="probe-right-col">
						<div class="d-flex mb-2">
							<v-btn
								outlined
								color="orange darken-1"
								class="flex-grow-1 mr-1"
								:disabled="buttonsDisabled"
								:loading="probingOp === 'x'"
								@click="probeAxis('x')"
							>
								<v-icon small left>mdi-arrow-right</v-icon>X
							</v-btn>
							<v-btn
								outlined
								color="orange darken-1"
								class="flex-grow-1"
								:disabled="buttonsDisabled"
								:loading="probingOp === 'y'"
								@click="probeAxis('y')"
							>
								<v-icon small left>mdi-arrow-up</v-icon>Y
							</v-btn>
						</div>
						<v-btn
							outlined
							color="orange darken-1"
							block
							:disabled="buttonsDisabled"
							:loading="probingOp === 'z'"
							@click="probeAxis('z')"
						>
							<v-icon small left>mdi-arrow-down</v-icon>Z
						</v-btn>
						<div class="caption text-center mt-1 grey--text">
							<v-icon x-small class="mr-1">mdi-axis-arrow</v-icon>Probe Individual Axis
						</div>
					</div>
				</div>

				<!-- Status message -->
				<div v-if="statusMessage" class="mt-4">
					<v-alert
						:type="statusType"
						dense
						text
						dismissible
						@input="statusMessage = ''"
					>
						{{ statusMessage }}
					</v-alert>
				</div>

			</v-card-text>
		</v-card>

		<!-- ── Settings (collapsible) ──────────────────────────────────────── -->
		<v-expansion-panels flat>
			<v-expansion-panel>
				<v-expansion-panel-header class="subtitle-1 font-weight-medium">
					Touch Probe Settings
					<template #actions>
						<v-btn
							text
							x-small
							color="orange darken-1"
							class="mr-2"
							:loading="deployingMacros"
							@click.stop="restoreMacros"
						>
							<v-icon x-small left>mdi-restore</v-icon>Restore Macros
						</v-btn>
						<v-btn
							text
							x-small
							color="grey"
							class="mr-2"
							@click.stop="resetDefaults"
						>
							<v-icon x-small left>mdi-undo</v-icon>Reset to Defaults
						</v-btn>
						<v-icon>mdi-chevron-down</v-icon>
					</template>
				</v-expansion-panel-header>

				<v-expansion-panel-content>
					<v-row dense class="mb-3">
						<v-col cols="12" sm="4">
							<v-text-field
								:value="feedrate"
								label="Feedrate (mm/min)"
								type="number"
								outlined
								dense
								hide-details
								min="1"
								@change="saveSetting('feedrate', $event)"
							/>
						</v-col>
					</v-row>

					<v-row dense>
						<v-col cols="12" sm="4">
							<v-text-field
								:value="plateX"
								label="Plate X Dimension (mm)"
								type="number"
								outlined
								dense
								hide-details
								step="0.1"
								min="0"
								@change="saveSetting('plateX', $event)"
							/>
						</v-col>
						<v-col cols="12" sm="4">
							<v-text-field
								:value="plateY"
								label="Plate Y Dimension (mm)"
								type="number"
								outlined
								dense
								hide-details
								step="0.1"
								min="0"
								@change="saveSetting('plateY', $event)"
							/>
						</v-col>
						<v-col cols="12" sm="4">
							<v-text-field
								:value="plateThickness"
								label="Plate Thickness (mm)"
								type="number"
								outlined
								dense
								hide-details
								step="0.001"
								min="0"
								@change="saveSetting('plateThickness', $event)"
							/>
						</v-col>
					</v-row>

					<v-row dense class="mt-3">
						<v-col cols="12" sm="4">
							<v-text-field
								:value="xOffset"
								label="X-Axis Offset (mm)"
								type="number"
								outlined
								dense
								hide-details
								step="0.001"
								@change="saveSetting('xOffset', $event)"
							/>
						</v-col>
						<v-col cols="12" sm="4">
							<v-text-field
								:value="yOffset"
								label="Y-Axis Offset (mm)"
								type="number"
								outlined
								dense
								hide-details
								step="0.001"
								@change="saveSetting('yOffset', $event)"
							/>
						</v-col>
					</v-row>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>

	</v-container>
</template>

<script>
import store from '@/store'
import { setPluginData, PluginDataType } from '@/store'
import { FileNotFoundError, getErrorMessage } from '@/utils/errors'
import { MACROS } from './macros.js'

const PLUGIN_ID   = 'ProbePanel'
const MACRO_PATH  = '0:/macros/ProbePanel'

const DEFAULTS = {
	endmillDia:     6.35,
	plateX:         60,
	plateY:         60,
	plateThickness: 5,
	xOffset:        10,
	yOffset:        10,
	feedrate:       500,
}

export default {
	name: 'ProbePanel',

	data() {
		return {
			selectedCorner:  'FL',
			probingOp:       null,
			deployingMacros: false,
			statusMessage:   '',
			statusType:      'success',
			cornerOptions: [
				{ text: 'Front Left Corner',  value: 'FL' },
				{ text: 'Front Right Corner', value: 'FR' },
				{ text: 'Back Left Corner',   value: 'BL' },
				{ text: 'Back Right Corner',  value: 'BR' },
			],
		}
	},

	computed: {
		uiFrozen()        { return store.getters['uiFrozen']; },
		buttonsDisabled() { return this.uiFrozen || this.probingOp !== null; },

		probeRawValue() {
			const probes = store.state.machine.model.sensors.probes;
			return (probes && probes.length > 0 && probes[0].value && probes[0].value.length > 0)
				? probes[0].value[0]
				: 0;
		},
		probeTriggered() { return this.probeRawValue > 500; },

		pluginSettings() {
			return store.state.machine.settings.plugins?.[PLUGIN_ID] ?? {};
		},
		endmillDia()     { return this.pluginSettings.endmillDia     ?? DEFAULTS.endmillDia; },
		plateX()         { return this.pluginSettings.plateX         ?? DEFAULTS.plateX; },
		plateY()         { return this.pluginSettings.plateY         ?? DEFAULTS.plateY; },
		plateThickness() { return this.pluginSettings.plateThickness ?? DEFAULTS.plateThickness; },
		xOffset()        { return this.pluginSettings.xOffset        ?? DEFAULTS.xOffset; },
		yOffset()        { return this.pluginSettings.yOffset        ?? DEFAULTS.yOffset; },
		feedrate()       { return this.pluginSettings.feedrate       ?? DEFAULTS.feedrate; },
	},

	async mounted() {
		await this.checkAndDeployMacros();
	},

	methods: {
		saveSetting(key, rawValue) {
			const value = parseFloat(rawValue);
			if (!isNaN(value)) {
				setPluginData(PLUGIN_ID, PluginDataType.machineSetting, key, value);
			}
		},

		resetDefaults() {
			for (const [key, value] of Object.entries(DEFAULTS)) {
				setPluginData(PLUGIN_ID, PluginDataType.machineSetting, key, value);
			}
		},

		async checkAndDeployMacros() {
			if (this.uiFrozen) return;
			try {
				await store.dispatch('machine/download', {
					filename: `${MACRO_PATH}/probe-corner.g`,
					type: 'text',
				});
			} catch (e) {
				if (e instanceof FileNotFoundError) {
					await this.deployMacros();
				}
			}
		},

		async deployMacros() {
			this.deployingMacros = true;
			try {
				for (const [name, content] of Object.entries(MACROS)) {
					await store.dispatch('machine/upload', {
						filename: `${MACRO_PATH}/${name}`,
						content:  new Blob([content], { type: 'text/plain' }),
						showProgress: false,
					});
				}
			} catch (e) {
				this.statusType    = 'error';
				this.statusMessage = `Failed to deploy macros: ${getErrorMessage(e)}`;
			} finally {
				this.deployingMacros = false;
			}
		},

		async restoreMacros() {
			await this.deployMacros();
			if (!this.statusMessage) {
				this.statusType    = 'success';
				this.statusMessage = 'Macros restored to default.';
			}
		},

		// Same corner-direction logic Ooznest's own touch probe panel uses: the plate is
		// physically rotated so its ledge always sits on the corner being probed, which
		// means for FR/BL the X and Y settings need to swap (the plate's own X side is
		// now running along the machine's Y axis, and vice versa).
		cornerParams() {
			const corner = this.selectedCorner;
			const xDirection      = (corner === 'FR' || corner === 'BR') ? -1 : 1;
			const xProbeDirection = (corner === 'FR' || corner === 'BR') ? 1  : 0;
			const yDirection      = (corner === 'BL' || corner === 'BR') ? -1 : 1;
			const yProbeDirection = (corner === 'BL' || corner === 'BR') ? 1  : 0;

			const swap = !(corner === 'FL' || corner === 'BR');
			return {
				xDirection, yDirection, xProbeDirection, yProbeDirection,
				xOffset:    swap ? this.yOffset : this.xOffset,
				yOffset:    swap ? this.xOffset : this.yOffset,
				xDimension: swap ? this.plateY  : this.plateX,
				yDimension: swap ? this.plateX  : this.plateY,
			};
		},

		buildM98(macro) {
			const p = this.cornerParams();
			return [
				`M98 P"${MACRO_PATH}/${macro}"`,
				`A${p.xDirection}`,
				`B${p.yDirection}`,
				`C${p.xProbeDirection}`,
				`D${p.yProbeDirection}`,
				`E${this.endmillDia.toFixed(4)}`,
				`F${this.plateThickness.toFixed(4)}`,
				`G${p.xOffset.toFixed(4)}`,
				`H${p.yOffset.toFixed(4)}`,
				`I${p.xDimension.toFixed(4)}`,
				`J${p.yDimension.toFixed(4)}`,
				`K${Math.round(this.feedrate)}`,
			].join(' ');
		},

		async probeCorner() {
			this.probingOp     = 'corner';
			this.statusMessage = '';
			try {
				await store.dispatch('machine/sendCode', this.buildM98('probe-corner.g'));
				this.statusType    = 'success';
				this.statusMessage = `${this.cornerOptions.find(c => c.value === this.selectedCorner)?.text} probed — WCS origin set.`;
			} catch (e) {
				this.statusType    = 'error';
				this.statusMessage = `Probe failed: ${getErrorMessage(e)}`;
			} finally {
				this.probingOp = null;
			}
		},

		async probeAxis(axis) {
			this.probingOp     = axis;
			this.statusMessage = '';
			try {
				await store.dispatch('machine/sendCode', this.buildM98(`probe-${axis}.g`));
				this.statusType    = 'success';
				this.statusMessage = `${axis.toUpperCase()} axis probed — WCS updated.`;
			} catch (e) {
				this.statusType    = 'error';
				this.statusMessage = `Probe failed: ${getErrorMessage(e)}`;
			} finally {
				this.probingOp = null;
			}
		},
	},
}
</script>

<style scoped>
.probe-controls-row {
	gap: 16px;
}
.probe-left-col {
	width: 160px;
	min-width: 160px;
}
.probe-mid-col {
	/* flex-grow-1 handles width */
}
.probe-right-col {
	width: 220px;
	min-width: 220px;
}
</style>
