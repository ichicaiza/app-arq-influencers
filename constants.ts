export const DEFAULT_PARAMS = {
  sexAge: '',
  physique: '',
  hair: '',
  extras: '',
  clothing: '',
  environment: '',
  action: '',
  style: 'Photorealism, 8k, cinematic lighting, highly detailed',
};

export const UI_OPTIONS = {
  sex: ['Woman', 'Man', 'Non-Binary'],
  age: ['18-20', '21-25', '26-30', '31-40', '40+'],
  hairColor: ['Blonde', 'Brunette', 'Black', 'Red', 'Pink', 'Silver', 'Neon Blue', 'Pastel'],
  hairStyle: ['Long Straight', 'Bob Cut', 'Pixie', 'Wavy/Curly', 'Braids', 'Ponytail', 'Buzz Cut', 'Bald'],
  physique: ['Slim', 'Athletic', 'Curvy', 'Muscular', 'Average', 'Plus Size'],
  extras: ['Glasses', 'Septum Piercing', 'Nose Ring', 'Freckles', 'Face Tattoos', 'Heavy Makeup', 'Gold Chains', 'Headphones'],
  clothing: ['Cyberpunk Techwear', 'Streetwear', 'Casual Chic', 'Luxury Suit', 'Swimwear', 'Vintage 90s', 'Sportswear', 'Fantasy Armor', 'Goth'],
  environment: ['Neon City Night', 'Sunny Beach', 'Dense Forest', 'Cozy Cafe', 'Minimalist Studio', 'Gym', 'Rooftop', 'Desert'],
  camera: ['Eye Level', 'Low Angle', 'High Angle', 'Drone Shot', 'Fish Eye', 'Macro'],
  style: ['Photorealism 8K', 'Cinematic', 'Anime', 'Cyberpunk', 'Vaporwave', 'Oil Painting', '3D Render', 'Pixel Art', 'Pop Art', 'Polaroid', 'B&W Noir'],
};

export const SYSTEM_INSTRUCTION = `
Actúa como un Ingeniero de Prompts de clase mundial, especializado en la creación de influencers virtuales hiperrealistas.

Tu único objetivo es tomar una lista de parámetros y transformarlos en 5 prompts de generación de imágenes extremadamente detallados y profesionales en INGLÉS.

Debes "mejorar" automáticamente las entradas, añadiendo detalles de iluminación (volumetric lighting, golden hour, neon noir, etc.), tipo de lente de cámara (85mm, 35mm, macro) y texturas (skin pores, fabric texture) para asegurar el máximo realismo.

Mantén la coherencia del personaje en los 5 prompts.

Retorna la respuesta estrictamente en formato JSON.
`;