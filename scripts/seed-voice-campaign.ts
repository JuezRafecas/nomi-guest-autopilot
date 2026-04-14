/**
 * Seed — leaves exactly one campaign in the DB for La Cabrera:
 * an exclusive "La Cabrera x Zuccardi" wine-pairing event targeting
 * a hardcoded list of 10 VIP guests via a voice-call workflow.
 *
 * Wipes all existing campaigns for the restaurant before inserting.
 *
 * Usage: npm run seed:voice-campaign
 */
import { createClient } from '@supabase/supabase-js';
import { requireEnv } from './_env';
import { voiceCampaignDraft } from '../lib/campaigns';
import { campaignInsertPayload } from '../lib/campaigns-db';
import { DEFAULT_RESTAURANT } from '../lib/constants';

const CAMPAIGN_NAME = 'La Cabrera x Zuccardi';
const CAMPAIGN_DESCRIPTION =
  'Cena exclusiva con maridaje de vinos Zuccardi para 10 invitados VIP. Invitación por llamada de voz.';

const GUESTS: Array<{ name: string; phone: string }> = [
  { name: 'Martín Rodríguez', phone: '+5491144110001' },
  { name: 'Sofía Fernández', phone: '+5491144110002' },
  { name: 'Lucas Gómez', phone: '+5491144110003' },
  { name: 'Valentina López', phone: '+5491144110004' },
  { name: 'Mateo Pérez', phone: '+5491144110005' },
  { name: 'Camila Martínez', phone: '+5491144110006' },
  { name: 'Joaquín Díaz', phone: '+5491144110007' },
  { name: 'Isabella Suárez', phone: '+5491144110008' },
  { name: 'Benjamín Romero', phone: '+5491144110009' },
  { name: 'Emilia Torres', phone: '+5491144110010' },
];

async function main() {
  const db = createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false } },
  );

  const { data: restaurant, error: restaurantErr } = await db
    .from('restaurants')
    .select('id')
    .eq('slug', DEFAULT_RESTAURANT.slug)
    .maybeSingle();
  if (restaurantErr) throw restaurantErr;
  if (!restaurant) {
    throw new Error(
      `Restaurant "${DEFAULT_RESTAURANT.slug}" not found. Run npm run seed first.`,
    );
  }
  console.log(`-> Restaurant: ${restaurant.id}`);

  const { error: deleteErr } = await db
    .from('campaigns')
    .delete()
    .eq('restaurant_id', restaurant.id);
  if (deleteErr) throw deleteErr;
  console.log('-> Wiped existing campaigns');

  const scheduleAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const draft = voiceCampaignDraft(restaurant.id, {
    name: CAMPAIGN_NAME,
    scheduleAt,
    members: GUESTS,
  });
  draft.description = CAMPAIGN_DESCRIPTION;
  draft.status = 'scheduled';

  const payload = campaignInsertPayload(draft);
  const { data: inserted, error: insertErr } = await db
    .from('campaigns')
    .insert(payload)
    .select('id, name, status, channels')
    .single();
  if (insertErr) throw insertErr;

  console.log(`\n✓ Created campaign ${inserted.id}`);
  console.log(`  name: ${inserted.name}`);
  console.log(`  status: ${inserted.status}`);
  console.log(`  channels: ${JSON.stringify(inserted.channels)}`);
  console.log(`  guests: ${GUESTS.length}`);
  console.log(`  scheduled_at: ${scheduleAt}`);
}

main().catch((err) => {
  console.error('\n✗ Seed failed:', err);
  process.exit(1);
});
