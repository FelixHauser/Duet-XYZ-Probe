'use strict'

export const PROBE_CORNER = `\
; probe-corner.g — XYZ corner probe for touch plate
; Part of the ProbePanel DWC plugin.
;
; This file is yours to customize — add moves, change probe order,
; whatever you need. Just leave the param.* variables below alone:
; they're filled in automatically from the Probe Panel screen every
; time you press a button. If you replace one with a fixed number,
; that field on the panel will stop having any effect on this macro.
;
; param.A  Corner ("FL" | "FR" | "BL" | "BR") — Probe Location dropdown
; param.B  Endmill Diameter (mm)
; param.C  Plate Thickness / Z Dimension (mm)
; param.D  X-Axis Offset (mm)
; param.E  Y-Axis Offset (mm)
; param.F  Z-Axis Offset (mm)
; param.G  Feedrate (mm/min)

var radius = param.B / 2

; Z probe
G91
M585 Z-50 F{param.G} P0 S0
G90
G10 L20 P0 Z{param.C + param.F}
G91
G1 Z5 F2000
G90

; X probe
if {param.A == "FL" || param.A == "BL"}
    M585 X-50 F{param.G} P0 S0
    G10 L20 P0 X{param.D + var.radius}
    G91
    G1 X5 F2000
    G90
else
    M585 X50 F{param.G} P0 S1
    G10 L20 P0 X{-(param.D + var.radius)}
    G91
    G1 X-5 F2000
    G90

; Y probe
if {param.A == "FL" || param.A == "FR"}
    M585 Y-50 F{param.G} P0 S0
    G10 L20 P0 Y{param.E + var.radius}
    G91
    G1 Y5 F2000
    G90
else
    M585 Y50 F{param.G} P0 S1
    G10 L20 P0 Y{-(param.E + var.radius)}
    G91
    G1 Y-5 F2000
    G90

T1
G0 Z10
G0 X0 Y0
`

export const PROBE_X = `\
; probe-x.g — X-only probe for touch plate
; Part of the ProbePanel DWC plugin.
;
; This file is yours to customize — add moves, change probe order,
; whatever you need. Just leave the param.* variables below alone:
; they're filled in automatically from the Probe Panel screen every
; time you press a button. If you replace one with a fixed number,
; that field on the panel will stop having any effect on this macro.
;
; param.A  Corner ("FL" | "FR" | "BL" | "BR") — Probe Location dropdown
; param.B  Endmill Diameter (mm)
; param.D  X-Axis Offset (mm)
; param.G  Feedrate (mm/min)

var radius = param.B / 2

if {param.A == "FL" || param.A == "BL"}
    M585 X-50 F{param.G} P0 S0
    G10 L20 P0 X{param.D + var.radius}
    G91
    G1 X5 F2000
    G90
else
    M585 X50 F{param.G} P0 S1
    G10 L20 P0 X{-(param.D + var.radius)}
    G91
    G1 X-5 F2000
    G90

T1
`

export const PROBE_Y = `\
; probe-y.g — Y-only probe for touch plate
; Part of the ProbePanel DWC plugin.
;
; This file is yours to customize — add moves, change probe order,
; whatever you need. Just leave the param.* variables below alone:
; they're filled in automatically from the Probe Panel screen every
; time you press a button. If you replace one with a fixed number,
; that field on the panel will stop having any effect on this macro.
;
; param.A  Corner ("FL" | "FR" | "BL" | "BR") — Probe Location dropdown
; param.B  Endmill Diameter (mm)
; param.E  Y-Axis Offset (mm)
; param.G  Feedrate (mm/min)

var radius = param.B / 2

if {param.A == "FL" || param.A == "FR"}
    M585 Y-50 F{param.G} P0 S0
    G10 L20 P0 Y{param.E + var.radius}
    G91
    G1 Y5 F2000
    G90
else
    M585 Y50 F{param.G} P0 S1
    G10 L20 P0 Y{-(param.E + var.radius)}
    G91
    G1 Y-5 F2000
    G90

T1
`

export const PROBE_Z = `\
; probe-z.g — Z-only probe for touch plate
; Part of the ProbePanel DWC plugin.
;
; This file is yours to customize — add moves, change probe order,
; whatever you need. Just leave the param.* variables below alone:
; they're filled in automatically from the Probe Panel screen every
; time you press a button. If you replace one with a fixed number,
; that field on the panel will stop having any effect on this macro.
;
; param.C  Plate Thickness / Z Dimension (mm)
; param.F  Z-Axis Offset (mm)
; param.G  Feedrate (mm/min)

G91
M585 Z-50 F{param.G} P0 S0
G90
G10 L20 P0 Z{param.C + param.F}
G91
G1 Z5 F2000
G90
T1
`

export const MACROS = {
    'probe-corner.g': PROBE_CORNER,
    'probe-x.g':      PROBE_X,
    'probe-y.g':      PROBE_Y,
    'probe-z.g':      PROBE_Z,
}
