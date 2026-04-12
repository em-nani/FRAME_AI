import { Project } from './types';

export async function generateProjectFromPrompt(prompt: string): Promise<Project> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const projectId = `proj_${Date.now()}`;
  const currentDate = new Date().toISOString();

  // Parse prompt for key details
  const promptLower = prompt.toLowerCase();
  const isLuxury = promptLower.includes('luxury') || promptLower.includes('high-end');
  const isStreetWear = promptLower.includes('streetwear') || promptLower.includes('street wear');
  const hasModels = promptLower.match(/(\d+)\s*models?/);
  const modelCount = hasModels ? parseInt(hasModels[1]) : 2;
  const isGoldenHour = promptLower.includes('golden hour') || promptLower.includes('sunset');
  const isRooftop = promptLower.includes('rooftop');
  const hasReel = promptLower.includes('reel') || promptLower.includes('video');
  const imageCountMatch = promptLower.match(/(\d+)\s*(?:final\s*)?images?/);
  const imageCount = imageCountMatch ? parseInt(imageCountMatch[1]) : 20;

  // Determine aesthetic
  let aesthetic = 'Editorial';
  if (promptLower.includes('moody')) aesthetic = 'Moody Editorial';
  if (promptLower.includes('minimal')) aesthetic = 'Minimal Clean';
  if (promptLower.includes('vibrant')) aesthetic = 'Vibrant Bold';
  if (promptLower.includes('film grain')) aesthetic += ' with Film Grain';

  // Generate mood board
  const moodBoardImages = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    'https://images.unsplash.com/photo-1558769132-cb1aea3c4bf5?w=800',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
  ];

  const colorPalette = isLuxury 
    ? ['#1a1a1a', '#d4af37', '#f5f5f5', '#8b7355', '#2c2c2c']
    : ['#000000', '#ffffff', '#ff6b6b', '#4ecdc4', '#95e1d3'];

  const keywords = [];
  if (isLuxury) keywords.push('Luxury', 'Premium', 'Refined');
  if (isStreetWear) keywords.push('Urban', 'Streetwear', 'Contemporary');
  if (promptLower.includes('moody')) keywords.push('Moody', 'Dramatic', 'Cinematic');
  if (promptLower.includes('editorial')) keywords.push('Editorial', 'Fashion', 'High-Fashion');
  
  // Generate pre-production timeline
  const shootDate = new Date();
  shootDate.setDate(shootDate.getDate() + 14); // 2 weeks from now
  
  const preProductionTimeline = [
    {
      id: '1',
      phase: 'Concept Development',
      task: 'Finalize creative brief and visual direction',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: 'Creative Director',
      status: 'in-progress' as const,
    },
    {
      id: '2',
      phase: 'Casting',
      task: `Cast ${modelCount} models matching aesthetic`,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: 'Producer',
      status: 'not-started' as const,
    },
    {
      id: '3',
      phase: 'Location',
      task: isRooftop ? 'Secure rooftop location and permits' : 'Scout and secure location',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: 'Producer',
      status: 'not-started' as const,
    },
    {
      id: '4',
      phase: 'Wardrobe',
      task: 'Source and confirm wardrobe selections',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: 'Stylist',
      status: 'not-started' as const,
    },
    {
      id: '5',
      phase: 'Equipment',
      task: 'Reserve camera, lighting, and grip equipment',
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: 'Photographer',
      status: 'not-started' as const,
    },
    {
      id: '6',
      phase: 'Final Prep',
      task: 'Distribute call sheet and confirm all details',
      deadline: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: 'Producer',
      status: 'not-started' as const,
    },
  ];

  // Generate call sheet
  const callSheet = {
    shootDate: shootDate.toISOString().split('T')[0],
    callTime: isGoldenHour ? '16:00' : '09:00',
    wrapTime: isGoldenHour ? '20:00' : '18:00',
    location: {
      name: isRooftop ? 'Downtown Rooftop' : 'Studio A',
      address: isRooftop ? '1234 Main St, Rooftop Level, Los Angeles, CA 90012' : '5678 Studio Blvd, Los Angeles, CA 90028',
      parking: 'Street parking available or valet at building entrance',
      notes: isRooftop ? 'Elevator access to rooftop. Backup indoor space available if weather is poor.' : 'Loading dock entrance on west side of building',
    },
    talent: Array.from({ length: modelCount }, (_, i) => ({
      id: `talent_${i + 1}`,
      role: `Model ${i + 1}`,
      name: 'TBD',
      callTime: isGoldenHour ? '16:00' : '09:00',
      notes: i === 0 ? 'Lead model - opens lookbook' : '',
    })),
    crew: [
      { id: 'crew_1', role: 'Photographer', name: 'TBD', contact: '', callTime: isGoldenHour ? '15:30' : '08:30' },
      { id: 'crew_2', role: 'Producer', name: 'TBD', contact: '', callTime: isGoldenHour ? '15:30' : '08:30' },
      { id: 'crew_3', role: 'Stylist', name: 'TBD', contact: '', callTime: isGoldenHour ? '15:00' : '08:00' },
      { id: 'crew_4', role: 'Hair & Makeup', name: 'TBD', contact: '', callTime: isGoldenHour ? '14:30' : '07:30' },
      { id: 'crew_5', role: '1st Assistant', name: 'TBD', contact: '', callTime: isGoldenHour ? '15:30' : '08:30' },
    ],
    schedule: [
      { id: 'sched_1', time: isGoldenHour ? '14:30' : '07:30', activity: 'Crew Call - Load In', location: 'Base Camp' },
      { id: 'sched_2', time: isGoldenHour ? '15:00' : '08:00', activity: 'Hair & Makeup Begins', location: 'Makeup Station' },
      { id: 'sched_3', time: isGoldenHour ? '16:00' : '09:00', activity: 'Talent Call', location: 'Base Camp' },
      { id: 'sched_4', time: isGoldenHour ? '16:30' : '09:30', activity: 'First Setup - Begin Shooting', location: 'Set' },
      { id: 'sched_5', time: isGoldenHour ? '18:00' : '13:00', activity: isGoldenHour ? 'Golden Hour Shots' : 'Lunch Break', location: isGoldenHour ? 'Set' : 'Catering' },
      { id: 'sched_6', time: isGoldenHour ? '19:30' : '17:30', activity: 'Wrap - Final Shots', location: 'Set' },
      { id: 'sched_7', time: isGoldenHour ? '20:00' : '18:00', activity: 'Wrap - Load Out', location: 'Base Camp' },
    ],
    emergency: {
      hospital: 'Cedars-Sinai Medical Center - (310) 423-5000',
      police: '911',
      contact: 'Production Manager: (555) 123-4567',
    },
  };

  // Generate shot list
  const shotList = [];
  const shotTypes = [
    { type: 'Wide Shot', lens: '35mm', desc: 'Full body establishing shot' },
    { type: 'Medium Shot', lens: '50mm', desc: 'Waist up, shows styling details' },
    { type: 'Close Up', lens: '85mm', desc: 'Face and expression, shallow DOF' },
    { type: 'Detail Shot', lens: '100mm Macro', desc: 'Accessories, fabric texture' },
  ];

  for (let i = 0; i < imageCount; i++) {
    const shotType = shotTypes[i % shotTypes.length];
    shotList.push({
      id: `shot_${i + 1}`,
      shotNumber: i + 1,
      description: `${shotType.desc} - Look ${Math.floor(i / 4) + 1}`,
      shotType: shotType.type,
      lens: shotType.lens,
      notes: i % 5 === 0 ? 'Hero shot for lookbook' : '',
      status: 'pending' as const,
    });
  }

  // Add reel breakdown if needed
  if (hasReel) {
    shotList.push({
      id: 'shot_reel_1',
      shotNumber: shotList.length + 1,
      description: 'B-Roll: Model walking sequence',
      shotType: 'Video',
      lens: '24-70mm',
      notes: '60fps for slow motion',
      status: 'pending' as const,
    });
    shotList.push({
      id: 'shot_reel_2',
      shotNumber: shotList.length + 2,
      description: 'B-Roll: Detail shots of garments in motion',
      shotType: 'Video',
      lens: '85mm',
      notes: '60fps for slow motion',
      status: 'pending' as const,
    });
    shotList.push({
      id: 'shot_reel_3',
      shotNumber: shotList.length + 3,
      description: 'B-Roll: Environmental shots of location',
      shotType: 'Video',
      lens: '35mm',
      notes: 'Establish atmosphere',
      status: 'pending' as const,
    });
  }

  // Generate equipment list
  const equipment = [
    { id: 'eq_1', category: 'Camera', item: 'Canon R5 or Sony A7R V', quantity: 1, notes: 'Primary body for stills', packed: false },
    { id: 'eq_2', category: 'Camera', item: hasReel ? 'Sony FX3 or A7S III' : 'Backup Camera Body', quantity: 1, notes: hasReel ? 'For video/reel' : 'Backup', packed: false },
    { id: 'eq_3', category: 'Lenses', item: '24-70mm f/2.8', quantity: 1, notes: 'Versatile zoom', packed: false },
    { id: 'eq_4', category: 'Lenses', item: '85mm f/1.4', quantity: 1, notes: 'Portrait and close-ups', packed: false },
    { id: 'eq_5', category: 'Lenses', item: '35mm f/1.4', quantity: 1, notes: 'Environmental portraits', packed: false },
    { id: 'eq_6', category: 'Lighting', item: 'Profoto B10 Plus (2x)', quantity: 2, notes: 'Main and fill light', packed: false },
    { id: 'eq_7', category: 'Lighting', item: '5-in-1 Reflector', quantity: 2, notes: 'Bounce and diffusion', packed: false },
    { id: 'eq_8', category: 'Lighting', item: isGoldenHour ? 'LED Panel for Fill' : 'Softbox 3x4ft', quantity: 1, notes: isGoldenHour ? 'Supplement natural light' : 'Soft key light', packed: false },
    { id: 'eq_9', category: 'Support', item: 'Tripod with Fluid Head', quantity: 1, notes: 'For video and stability', packed: false },
    { id: 'eq_10', category: 'Support', item: 'Light Stands (3x)', quantity: 3, notes: 'For strobes and flags', packed: false },
    { id: 'eq_11', category: 'Accessories', item: 'Memory Cards (128GB x4)', quantity: 4, notes: 'High-speed for burst', packed: false },
    { id: 'eq_12', category: 'Accessories', item: 'Extra Batteries', quantity: 6, notes: '3 per camera body', packed: false },
    { id: 'eq_13', category: 'Accessories', item: 'Tethering Kit (Laptop + Cable)', quantity: 1, notes: 'For client review on set', packed: false },
  ];

  // Generate budget
  const budgetItems = [
    { id: 'bg_1', category: 'Talent', item: `Models (${modelCount}x)`, estimatedCost: modelCount * 800, notes: '$800/day per model' },
    { id: 'bg_2', category: 'Crew', item: 'Hair & Makeup Artist', estimatedCost: 600, notes: 'Day rate' },
    { id: 'bg_3', category: 'Crew', item: 'Stylist + Assistant', estimatedCost: 900, notes: '$600 stylist + $300 assistant' },
    { id: 'bg_4', category: 'Crew', item: '1st Camera Assistant', estimatedCost: 400, notes: 'Day rate' },
    { id: 'bg_5', category: 'Location', item: isRooftop ? 'Rooftop Location Fee' : 'Studio Rental', estimatedCost: isRooftop ? 1200 : 800, notes: isRooftop ? '8 hours' : 'Full day rate' },
    { id: 'bg_6', category: 'Equipment', item: 'Camera & Lens Package', estimatedCost: 450, notes: 'Rental for 2 days' },
    { id: 'bg_7', category: 'Equipment', item: 'Lighting Package', estimatedCost: 350, notes: 'Strobes and modifiers' },
    { id: 'bg_8', category: 'Wardrobe', item: 'Wardrobe Pulls & Garments', estimatedCost: 1500, notes: isStreetWear ? 'Streetwear pieces' : 'Luxury pieces' },
    { id: 'bg_9', category: 'Production', item: 'Catering & Craft Services', estimatedCost: 400, notes: 'Full crew and talent' },
    { id: 'bg_10', category: 'Production', item: 'Transportation & Parking', estimatedCost: 200, notes: 'Crew and equipment' },
    { id: 'bg_11', category: 'Post-Production', item: 'Retouching', estimatedCost: imageCount * 45, notes: `${imageCount} images @ $45 each` },
    { id: 'bg_12', category: 'Post-Production', item: hasReel ? 'Video Editing & Color' : 'Color Grading', estimatedCost: hasReel ? 1200 : 400, notes: hasReel ? '60-second reel' : 'Photo grading' },
  ];

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);

  // Generate post-production timeline
  const postProductionTimeline = [
    {
      id: 'post_1',
      phase: 'Culling',
      task: 'Review and select best takes from shoot',
      deadline: new Date(shootDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: 'Photographer',
      status: 'not-started' as const,
    },
    {
      id: 'post_2',
      phase: 'Selects',
      task: `Narrow down to ${imageCount} final selects`,
      deadline: new Date(shootDate.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: 'Creative Director',
      status: 'not-started' as const,
    },
    {
      id: 'post_3',
      phase: 'Retouching',
      task: 'Professional retouching of final images',
      deadline: new Date(shootDate.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: 'Retoucher',
      status: 'not-started' as const,
    },
    {
      id: 'post_4',
      phase: 'Video Edit',
      task: hasReel ? 'Edit and color grade 60-second reel' : 'Color grade final images',
      deadline: new Date(shootDate.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: hasReel ? 'Video Editor' : 'Colorist',
      status: 'not-started' as const,
    },
    {
      id: 'post_5',
      phase: 'Client Review',
      task: 'Present finals to client for approval',
      deadline: new Date(shootDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: 'Creative Director',
      status: 'not-started' as const,
    },
    {
      id: 'post_6',
      phase: 'Revisions',
      task: 'Implement client feedback and final tweaks',
      deadline: new Date(shootDate.getTime() + 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: 'Retoucher',
      status: 'not-started' as const,
    },
    {
      id: 'post_7',
      phase: 'Delivery',
      task: 'Export and deliver all final assets',
      deadline: new Date(shootDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      owner: 'Producer',
      status: 'not-started' as const,
    },
  ];

  // Generate deliverables
  const deliverables = [
    {
      id: 'del_1',
      type: 'High-Res Images',
      dimensions: '5472 x 3648px',
      platform: 'Print & Web',
      quantity: imageCount,
      status: 'pending' as const,
    },
    {
      id: 'del_2',
      type: 'Instagram Posts',
      dimensions: '1080 x 1080px',
      platform: 'Instagram',
      quantity: imageCount,
      status: 'pending' as const,
    },
    {
      id: 'del_3',
      type: 'Instagram Stories',
      dimensions: '1080 x 1920px',
      platform: 'Instagram Stories',
      quantity: 15,
      status: 'pending' as const,
    },
  ];

  if (hasReel) {
    deliverables.push(
      {
        id: 'del_4',
        type: '60-Second Reel',
        dimensions: '1080 x 1920px',
        platform: 'Instagram Reels / TikTok',
        quantity: 1,
        status: 'pending' as const,
      },
      {
        id: 'del_5',
        type: '60-Second Reel',
        dimensions: '1920 x 1080px',
        platform: 'YouTube / Website',
        quantity: 1,
        status: 'pending' as const,
      }
    );
  }

  return {
    id: projectId,
    name: `${isLuxury ? 'Luxury' : ''} ${isStreetWear ? 'Streetwear' : 'Fashion'} Lookbook Campaign`,
    prompt,
    createdAt: currentDate,
    status: 'planning',
    moodBoard: {
      images: moodBoardImages,
      colorPalette,
      keywords,
      aesthetic,
    },
    preProduction: {
      timeline: preProductionTimeline,
    },
    callSheet,
    shotList,
    equipment,
    budget: {
      totalEstimate: totalBudget,
      lineItems: budgetItems,
    },
    postProduction: {
      timeline: postProductionTimeline,
    },
    deliverables,
  };
}
