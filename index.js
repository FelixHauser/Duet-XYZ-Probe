'use strict'

import { registerRoute } from '../../routes'
import { registerPluginData, PluginDataType } from '../../store'

import ProbePanel from './ProbePanel.vue'

registerRoute(ProbePanel, {
	Plugins: {
		ProbePanel: {
			icon: 'mdi-crosshairs-gps',
			caption: 'XYZ Probe',
			path: '/Plugins/ProbePanel'
		}
	}
});

registerPluginData('ProbePanel', PluginDataType.machineSetting, 'endmillDia', 6.35);
registerPluginData('ProbePanel', PluginDataType.machineSetting, 'plateX', 60);
registerPluginData('ProbePanel', PluginDataType.machineSetting, 'plateY', 60);
registerPluginData('ProbePanel', PluginDataType.machineSetting, 'plateZ', 10);
registerPluginData('ProbePanel', PluginDataType.machineSetting, 'xOffset', 10);
registerPluginData('ProbePanel', PluginDataType.machineSetting, 'yOffset', 10);
registerPluginData('ProbePanel', PluginDataType.machineSetting, 'zOffset', 5);
registerPluginData('ProbePanel', PluginDataType.machineSetting, 'feedrate', 500);
