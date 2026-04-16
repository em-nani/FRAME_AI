import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// ── Tool schema ───────────────────────────────────────────────────────────────
// Defines the exact JSON shape Claude must return. IDs and top-level metadata
// are added server-side so Claude never has to generate them.

const CREATE_PROJECT_TOOL: Anthropic.Tool = {
  name: 'create_project',
  description: 'Generate a complete, realistic fashion/creative production plan based on the given brief.',
  input_schema: {
    type: 'object',
    required: ['name', 'moodBoard', 'preProduction', 'callSheet', 'shotList', 'equipment', 'budget', 'postProduction', 'deliverables'],
    properties: {
      name: {
        type: 'string',
        description: 'Evocative campaign/project name, e.g. "Noir Luxe — SS25 Editorial"',
      },
      moodBoard: {
        type: 'object',
        required: ['colorPalette', 'keywords', 'aesthetic', 'imageQueries'],
        properties: {
          colorPalette: {
            type: 'array',
            description: 'Array of 4–6 hex color codes that define the visual palette',
            items: { type: 'string' },
            minItems: 4,
            maxItems: 6,
          },
          keywords: {
            type: 'array',
            description: 'Array of 5–8 single-word or short-phrase mood/aesthetic descriptors',
            items: { type: 'string' },
            minItems: 5,
            maxItems: 8,
          },
          aesthetic: {
            type: 'string',
            description: 'One-line aesthetic summary, e.g. "Moody editorial with film grain and high contrast"',
          },
          imageQueries: {
            type: 'array',
            description: 'Exactly 6 short Unsplash search queries (2–4 words each) that would return images matching the mood and aesthetic. Be specific and visual, e.g. ["moody fashion editorial", "dark luxury clothing", "film grain portrait", "urban rooftop fashion", "high contrast black white", "dramatic lighting model"]',
            items: { type: 'string' },
            minItems: 6,
            maxItems: 6,
          },
        },
      },
      preProduction: {
        type: 'object',
        required: ['timeline'],
        properties: {
          timeline: {
            type: 'array',
            description: 'Pre-production task list ordered by deadline, covering all phases from concept through final prep',
            items: {
              type: 'object',
              required: ['phase', 'task', 'deadline', 'owner', 'status'],
              properties: {
                phase: { type: 'string', description: 'Phase name, e.g. "Concept Development", "Casting", "Location", "Wardrobe", "Equipment", "Final Prep"' },
                task: { type: 'string', description: 'Specific, actionable task description' },
                deadline: { type: 'string', description: 'ISO date string YYYY-MM-DD, spaced realistically leading up to the shoot date' },
                owner: { type: 'string', description: 'Role responsible, e.g. "Creative Director", "Producer", "Stylist"' },
                status: { type: 'string', enum: ['not-started', 'in-progress', 'completed'] },
              },
            },
            minItems: 5,
          },
        },
      },
      callSheet: {
        type: 'object',
        required: ['shootDate', 'callTime', 'wrapTime', 'location', 'talent', 'crew', 'schedule', 'emergency'],
        properties: {
          shootDate: { type: 'string', description: 'YYYY-MM-DD — typically 10–21 days from today' },
          callTime: { type: 'string', description: 'HH:MM — general crew call time' },
          wrapTime: { type: 'string', description: 'HH:MM — estimated wrap time' },
          location: {
            type: 'object',
            required: ['name', 'address', 'parking', 'notes'],
            properties: {
              name: { type: 'string' },
              address: { type: 'string', description: 'Full street address' },
              parking: { type: 'string', description: 'Parking/access instructions' },
              notes: { type: 'string', description: 'Any location-specific notes (access codes, backup plans, etc.)' },
            },
          },
          talent: {
            type: 'array',
            description: 'List of talent/models with individual call times',
            items: {
              type: 'object',
              required: ['role', 'name', 'callTime', 'notes'],
              properties: {
                role: { type: 'string', description: 'e.g. "Lead Model", "Model 2"' },
                name: { type: 'string', description: 'Use "TBD" if not yet cast' },
                callTime: { type: 'string', description: 'HH:MM' },
                notes: { type: 'string' },
              },
            },
          },
          crew: {
            type: 'array',
            description: 'Production crew list',
            items: {
              type: 'object',
              required: ['role', 'name', 'contact', 'callTime'],
              properties: {
                role: { type: 'string', description: 'e.g. "Photographer", "Producer", "Stylist", "Hair & Makeup"' },
                name: { type: 'string', description: 'Use "TBD" if not yet booked' },
                contact: { type: 'string', description: 'Phone number or email, or empty string' },
                callTime: { type: 'string', description: 'HH:MM' },
              },
            },
            minItems: 4,
          },
          schedule: {
            type: 'array',
            description: 'Day-of shoot schedule from load-in to wrap',
            items: {
              type: 'object',
              required: ['time', 'activity', 'location'],
              properties: {
                time: { type: 'string', description: 'HH:MM' },
                activity: { type: 'string', description: 'What is happening at this time' },
                location: { type: 'string', description: 'Where this activity takes place on set' },
              },
            },
            minItems: 5,
          },
          emergency: {
            type: 'object',
            required: ['hospital', 'police', 'contact'],
            properties: {
              hospital: { type: 'string', description: 'Nearest hospital name and number' },
              police: { type: 'string', description: '911 or local non-emergency line' },
              contact: { type: 'string', description: 'On-set production contact and phone' },
            },
          },
        },
      },
      shotList: {
        type: 'array',
        description: 'Shot-by-shot breakdown covering all looks and setups',
        items: {
          type: 'object',
          required: ['shotNumber', 'description', 'shotType', 'lens', 'notes', 'status'],
          properties: {
            shotNumber: { type: 'number' },
            description: { type: 'string', description: 'What the shot captures, e.g. "Full body look 1, model facing camera"' },
            shotType: { type: 'string', description: 'e.g. "Wide Shot", "Medium Shot", "Close Up", "Detail Shot", "Video"' },
            lens: { type: 'string', description: 'e.g. "35mm", "85mm f/1.4", "100mm Macro"' },
            notes: { type: 'string', description: 'Any special instructions, lighting notes, or hero shot flags' },
            status: { type: 'string', enum: ['pending', 'captured', 'approved'] },
          },
        },
        minItems: 8,
      },
      equipment: {
        type: 'array',
        description: 'Full equipment list grouped into categories: Camera, Lenses, Lighting, Support, Accessories',
        items: {
          type: 'object',
          required: ['category', 'item', 'quantity', 'notes'],
          properties: {
            category: { type: 'string', description: '"Camera" | "Lenses" | "Lighting" | "Support" | "Accessories"' },
            item: { type: 'string', description: 'Specific gear item name/model' },
            quantity: { type: 'number' },
            notes: { type: 'string', description: 'Purpose or rental notes' },
          },
        },
        minItems: 8,
      },
      budget: {
        type: 'object',
        required: ['lineItems'],
        properties: {
          lineItems: {
            type: 'array',
            description: 'Budget line items grouped into categories: Talent, Crew, Location, Equipment, Wardrobe, Production, Post-Production',
            items: {
              type: 'object',
              required: ['category', 'item', 'estimatedCost', 'notes'],
              properties: {
                category: { type: 'string' },
                item: { type: 'string' },
                estimatedCost: { type: 'number', description: 'USD amount, no cents needed' },
                notes: { type: 'string', description: 'Rate basis or line-item context, e.g. "$800/day"' },
              },
            },
            minItems: 8,
          },
        },
      },
      postProduction: {
        type: 'object',
        required: ['timeline'],
        properties: {
          timeline: {
            type: 'array',
            description: 'Post-production task list ordered by deadline, from culling through final delivery',
            items: {
              type: 'object',
              required: ['phase', 'task', 'deadline', 'owner', 'status'],
              properties: {
                phase: { type: 'string', description: 'Phase name, e.g. "Culling", "Selects", "Retouching", "Color Grade", "Client Review", "Delivery"' },
                task: { type: 'string' },
                deadline: { type: 'string', description: 'YYYY-MM-DD — spaced realistically after the shoot date' },
                owner: { type: 'string', description: 'Role responsible, e.g. "Photographer", "Retoucher", "Video Editor", "Creative Director"' },
                status: { type: 'string', enum: ['not-started', 'in-progress', 'completed'] },
              },
            },
            minItems: 5,
          },
        },
      },
      deliverables: {
        type: 'array',
        description: 'Final assets to be delivered, covering all platforms and formats',
        items: {
          type: 'object',
          required: ['type', 'dimensions', 'platform', 'quantity', 'status'],
          properties: {
            type: { type: 'string', description: 'e.g. "High-Res Images", "Instagram Posts", "60-Second Reel"' },
            dimensions: { type: 'string', description: 'e.g. "1080×1080px", "5472×3648px"' },
            platform: { type: 'string', description: 'Target platform, e.g. "Instagram", "Print & Web"' },
            quantity: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'delivered'] },
          },
        },
        minItems: 3,
      },
    },
  },
};

// ── Handler ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body as { prompt?: unknown };

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'prompt is required and must be a non-empty string' });
  }

  if (prompt.length > 2000) {
    return res.status(400).json({ error: 'prompt must be 2000 characters or fewer' });
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      system: `You are an expert creative production planner for high-end fashion and commercial photography campaigns.
Your job is to generate a complete, realistic, and detailed production plan based on a creative brief.

Guidelines:
- Today's date is ${today}. All deadlines must be real calendar dates relative to today.
- Shoot date should be 10–21 days from today. Pre-production tasks lead up to it; post-production tasks follow it.
- Generate specific, professional detail — not generic placeholders. Real-sounding locations, precise gear, itemized budgets.
- Budgets should be realistic for a mid-to-high-end production (day rates, location fees, equipment rentals).
- Shot lists should reflect the number of looks/images mentioned in the brief.
- Color palettes should feel intentional and cohesive with the aesthetic described.
- Keywords should be specific and evocative, not generic (avoid words like "stylish" or "cool").
- All status fields default to "not-started" unless the brief implies work has already begun.`,
      tools: [CREATE_PROJECT_TOOL],
      tool_choice: { type: 'tool', name: 'create_project' },
      messages: [
        { role: 'user', content: `Creative brief: ${prompt.trim()}` },
      ],
    });

    // Extract the tool call result
    const toolUse = response.content.find((block: Anthropic.ContentBlock): block is Anthropic.ToolUseBlock => block.type === 'tool_use');

    if (!toolUse || toolUse.name !== 'create_project') {
      return res.status(500).json({ error: 'Unexpected response from Claude — no tool call returned' });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generated = toolUse.input as any;

    // Add server-side IDs and metadata — Claude never generates these
    const now = new Date().toISOString();
    const project = {
      id: `proj_${newId()}`,
      name: generated.name,
      prompt: prompt.trim(),
      createdAt: now,
      status: 'planning' as const,
      moodBoard: {
        images: (generated.moodBoard.imageQueries as string[]).map(
          (q: string) => `https://source.unsplash.com/800x800/?${encodeURIComponent(q)}`
        ),
        colorPalette: generated.moodBoard.colorPalette,
        keywords: generated.moodBoard.keywords,
        aesthetic: generated.moodBoard.aesthetic,
      },
      preProduction: {
        timeline: generated.preProduction.timeline.map((item: any) => ({ id: newId(), ...item })),
      },
      callSheet: {
        ...generated.callSheet,
        talent: generated.callSheet.talent.map((t: any) => ({ id: newId(), ...t })),
        crew:   generated.callSheet.crew.map((c: any) => ({ id: newId(), ...c })),
        schedule: generated.callSheet.schedule.map((s: any) => ({ id: newId(), ...s })),
      },
      shotList: generated.shotList.map((shot: any) => ({ id: newId(), ...shot })),
      equipment: generated.equipment.map((item: any) => ({ id: newId(), packed: false, ...item })),
      budget: {
        lineItems: generated.budget.lineItems.map((item: any) => ({ id: newId(), ...item })),
        totalEstimate: generated.budget.lineItems.reduce((sum: number, item: any) => sum + (item.estimatedCost ?? 0), 0),
      },
      postProduction: {
        timeline: generated.postProduction.timeline.map((item: any) => ({ id: newId(), ...item })),
      },
      deliverables: generated.deliverables.map((d: any) => ({ id: newId(), ...d })),
    };

    return res.status(200).json(project);
  } catch (error) {
    console.error('Generation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Failed to generate project', details: message });
  }
}
