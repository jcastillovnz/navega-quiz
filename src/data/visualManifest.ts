export type VisualFamily =
  | 'RIPA_RULE_12' | 'RIPA_RULE_13' | 'RIPA_RULE_14' | 'RIPA_RULE_15' | 'RIPA_RULE_18'
  | 'RIPA_LIGHTS' | 'RIPA_DAY_ANCHORED' | 'RIPA_DAY_AGROUND' | 'RIPA_DAY_TRAWLING' | 'RIPA_SOUND'
  | 'IALA_PORT' | 'IALA_STARBOARD' | 'IALA_CARDINAL_N' | 'IALA_CARDINAL_E'
  | 'IALA_CARDINAL_S' | 'IALA_CARDINAL_W' | 'IALA_ISOLATED' | 'IALA_SAFE'
  | 'IALA_SPECIAL' | 'IALA_NEW_DANGER'
  | 'SAFETY_INVENTORY' | 'SAFETY_FIRE' | 'SAFETY_DAMAGE' | 'SAFETY_STORM'
  | 'SAFETY_HAA' | 'SAFETY_ANCHOR'
  | 'NOM_HULL' | 'NOM_RIGGING' | 'NOM_ANCHOR'
  | 'MET_FORECAST' | 'MET_PRESSURE' | 'MET_BREEZE' | 'MET_WAVES' | 'MET_WIND'
  | 'MET_PAMPERO' | 'MET_SUDESTADA' | 'MET_BEAUFORT'
  | 'KNOT_BOWLINE' | 'KNOT_REEF' | 'KNOT_CLOVE' | 'KNOT_SHEET_BEND' | 'KNOT_FIGURE_EIGHT'
  | 'PRACTICAL_CHART' | 'PRACTICAL_CALCULATION';

export interface VisualSpec {
  family: VisualFamily;
  evidence: string;
}

const manifest: Record<string, VisualSpec> = {};
const assign = (ids: string[], family: VisualFamily, evidence: string) => {
  ids.forEach(id => { manifest[id] = { family, evidence }; });
};

assign(['ripa_1', 'ripa_22'], 'RIPA_RULE_12', 'Banda de entrada del viento y posición de ambos veleros');
assign(['ripa_2'], 'RIPA_RULE_13', 'Sector de alcance, proas, popas y estelas');
assign(['ripa_3', 'ripa_21'], 'RIPA_RULE_14', 'Rumbos opuestos y caída de ambos buques a estribor');
assign(['ripa_4', 'ripa_11', 'ripa_12'], 'RIPA_RULE_15', 'Buque que ve al otro por estribor y maniobra para ceder');
assign(['ripa_5', 'ripa_23', 'ripa_34', 'ripa_36'], 'RIPA_RULE_18', 'Categoría de cada buque y obligación de mantenerse apartado');
assign(['ripa_6'], 'RIPA_DAY_ANCHORED', 'Una esfera negra en la parte de proa del buque fondeado');
assign(['ripa_16'], 'RIPA_DAY_AGROUND', 'Tres esferas negras verticales y casco apoyado en bajo fondo');
assign(['ripa_17'], 'RIPA_DAY_TRAWLING', 'Dos conos negros con vértices unidos y aparejo de arrastre');
assign(['ripa_7', 'ripa_8', 'ripa_9', 'ripa_10', 'ripa_15', 'ripa_18', 'ripa_19', 'ripa_20', 'ripa_24', 'ripa_25', 'ripa_26', 'ripa_33', 'ripa_35'], 'RIPA_LIGHTS', 'Color, disposición, sector y perspectiva de las luces');
assign(['ripa_13', 'ripa_14', 'ripa_27', 'ripa_28', 'ripa_29', 'ripa_30', 'ripa_31', 'ripa_32', 'ripa_sound_port', 'ripa_sound_doubt', 'ripa_sound_overtake_starboard', 'ripa_sound_overtake_port', 'ripa_sound_overtake_agree', 'ripa_sound_bend', 'ripa_sound_stopped_fog', 'ripa_sound_anchor_fog'], 'RIPA_SOUND', 'Secuencia de pitadas o campana y duración reglamentaria');

assign(['iala_1'], 'IALA_PORT', 'Color y forma de la marca lateral de babor en Región B');
assign(['iala_2'], 'IALA_STARBOARD', 'Color, forma y luz de la marca lateral de estribor en Región B');
assign(['iala_9', 'iala_10'], 'IALA_PORT', 'Par lateral completo y sentido de entrada desde el mar');
assign(['iala_3', 'iala_5', 'iala_isolated_2'], 'IALA_ISOLATED', 'Bandas, esferas superiores, peligro y ritmo Fl(2)');
assign(['iala_4', 'iala_safe_2'], 'IALA_SAFE', 'Franjas verticales, esfera y aguas navegables alrededor');
assign(['iala_6', 'iala_7', 'iala_card_n_1', 'iala_card_n_2'], 'IALA_CARDINAL_N', 'Conos, bandas y cuadrante seguro al norte');
assign(['iala_card_e_1'], 'IALA_CARDINAL_E', 'Conos, bandas y grupo de tres destellos');
assign(['iala_card_s_1'], 'IALA_CARDINAL_S', 'Conos, bandas y seis destellos más uno largo');
assign(['iala_card_w_1'], 'IALA_CARDINAL_W', 'Conos, bandas y grupo de nueve destellos');
assign(['iala_8', 'iala_special_1'], 'IALA_SPECIAL', 'Color amarillo, aspa y propósito indicado en la carta');
assign(['iala_new_danger_1'], 'IALA_NEW_DANGER', 'Franjas azul/amarillo y luz alternada');

assign(['seg_1', 'seg_2', 'seg_8', 'seg_9', 'seg_10', 'seg_11', 'seg_12', 'seg_13', 'seg_14', 'seg_15', 'seg_17', 'seg_19', 'seg_20', 'seg_21', 'seg_22', 'seg_23'], 'SAFETY_INVENTORY', 'Objeto, equipo o requisito de seguridad evaluado');
assign(['seg_3', 'seg_4', 'seg_5', 'seg_6', 'seg_18', 'seg_24', 'seg_25'], 'SAFETY_ANCHOR', 'Ancla, cadena, línea, fondo y configuración de fondeo');
assign(['seg_7', 'seg_fire_1', 'seg_fire_2', 'seg_fire_3', 'seg_fire_4', 'seg_fire_5', 'seg_fire_6', 'seg_fire_7'], 'SAFETY_FIRE', 'Combustible, clase de fuego y agente extintor');
assign(['seg_16'], 'SAFETY_HAA', 'Posición del náufrago y maniobra de recuperación');
assign(['seg_averia_1', 'seg_averia_2', 'seg_averia_3', 'seg_averia_4', 'seg_remolque_1', 'seg_abandono_1'], 'SAFETY_DAMAGE', 'Avería visible y orden de acciones');
assign(['seg_temporal_1', 'seg_temporal_2', 'seg_temporal_3', 'seg_temporal_4'], 'SAFETY_STORM', 'Viento, oleaje, costa a sotavento y estrategia');

assign(Array.from({ length: 38 }, (_, i) => `nom_${i + 1}`), 'NOM_HULL', 'Elemento del casco destacado dentro de su contexto');
assign(Array.from({ length: 23 }, (_, i) => `nom_${i + 39}`), 'NOM_RIGGING', 'Elemento de jarcia, vela o maniobra destacado');
assign(['nom_61'], 'NOM_ANCHOR', 'Bosa y punto de afirmado dentro del conjunto');
assign(['nom_62', 'nom_63', 'nom_64', 'nom_65'], 'NOM_HULL', 'Instrumento completo, escala y variable medida');

assign(['met_forecast_1'], 'MET_FORECAST', 'Pronóstico, momento de actualización y evolución');
assign(['met_pressure_1', 'met_pressure_2', 'met_8', 'met_10', 'met_11', 'met_9', 'met_16'], 'MET_PRESSURE', 'Instrumento, isobaras y cambio atmosférico');
assign(['met_breeze_1', 'met_breeze_2'], 'MET_BREEZE', 'Diferencia térmica y dirección costa-mar');
assign(['met_wave_1', 'met_wave_2', 'met_12', 'met_13'], 'MET_WAVES', 'Altura, período, fetch y orientación del barco');
assign(['met_wind_1', 'met_wind_2', 'met_15'], 'MET_WIND', 'Dirección, velocidad e instrumentos del viento');
assign(['met_1'], 'MET_PAMPERO', 'Frente frío y entrada del viento desde el sudoeste');
assign(['met_2', 'met_14'], 'MET_SUDESTADA', 'Viento sudeste y acumulación de agua sobre la costa argentina');
assign(['met_3', 'met_4', 'met_5', 'met_6', 'met_7'], 'MET_BEAUFORT', 'Fuerza del viento, nube y estado correspondiente del mar');

assign(['nudo_1', 'nudo_6'], 'KNOT_BOWLINE', 'Chicote, firme, seno y gaza fija terminada');
assign(['nudo_2', 'nudo_8', 'nudo_17'], 'KNOT_REEF', 'Cruces simétricos y resultado del nudo llano');
assign(['nudo_3', 'nudo_18'], 'KNOT_CLOVE', 'Vueltas del cabo alrededor del soporte');
assign(['nudo_4', 'nudo_7'], 'KNOT_SHEET_BEND', 'Unión de cabos de distinto diámetro');
assign(['nudo_5', 'nudo_15'], 'KNOT_FIGURE_EIGHT', 'Nudo de tope y recorrido del chicote');
assign(['nudo_9', 'nudo_10', 'nudo_11', 'nudo_12', 'nudo_13', 'nudo_14', 'nudo_16'], 'KNOT_BOWLINE', 'Cabo o elemento de jarcia observado en detalle');

assign(['prac_carta_1', 'prac_carta_2', 'prac_carta_3'], 'PRACTICAL_CHART', 'Carta, escala de latitud y medición de distancia');
assign(Array.from({ length: 18 }, (_, i) => `prac_${i + 1}`), 'PRACTICAL_CALCULATION', 'Datos, fórmula, unidades y secuencia de resolución');

export const getVisualSpec = (questionId: string): VisualSpec | undefined => manifest[questionId];
export const visualManifest = manifest;
