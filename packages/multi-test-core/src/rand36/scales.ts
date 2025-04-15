import {IScaleFactory} from "../util/interfaces";

/**
 * Interface representing the RAND 36-Item Health Survey (SF-36) scales
 */
export interface IRAND36Scales {
    /**
     * Physical Functioning - measures limitations in physical activities
     * because of health problems
     */
    "PF": number;
    
    /**
     * Role functioning/physical - measures limitations in usual role
     * activities because of physical health problems
     */
    "RP": number;
    
    /**
     * Bodily Pain - measures pain intensity and its impact on normal activities
     */
    "BP": number;
    
    /**
     * General Health - measures personal evaluations of current health,
     * health outlook, and resistance to illness
     */
    "GH": number;
    
    /**
     * Vitality (Energy/fatigue) - measures feelings of energy, pep, fatigue, and tiredness
     */
    "VT": number;
    
    /**
     * Social functioning - measures limitations in social activities
     * due to physical or emotional problems
     */
    "SF": number;
    
    /**
     * Role functioning/emotional - measures limitations in usual role
     * activities because of emotional problems
     */
    "RE": number;
    
    /**
     * Mental Health (Emotional well-being) - measures feelings of nervousness,
     * depression, calmness, happiness, and peacefulness
     */
    "MH": number;
}

export const createBlankScales: IScaleFactory<IRAND36Scales> = (v) => ({
    "PF": v,
    "RP": v,
    "BP": v, 
    "GH": v,
    "VT": v,
    "SF": v,
    "RE": v,
    "MH": v
}); 