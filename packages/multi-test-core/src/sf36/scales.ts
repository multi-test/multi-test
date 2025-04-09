import {IScaleFactory} from "../util/interfaces";

export interface ISF36Scales {
    // Physical health scales
    "PF": number; // Physical Functioning
    "RP": number; // Role limitations due to physical health
    "BP": number; // Bodily Pain
    "GH": number; // General Health
    
    // Mental health scales
    "VT": number; // Vitality/Energy/Fatigue
    "SF": number; // Social Functioning
    "RE": number; // Role limitations due to emotional problems
    "MH": number; // Mental Health/Emotional well-being
}

export const createBlankScales: IScaleFactory<ISF36Scales> = (v) => ({
    "PF": v,
    "RP": v,
    "BP": v, 
    "GH": v,
    "VT": v,
    "SF": v,
    "RE": v,
    "MH": v
}); 