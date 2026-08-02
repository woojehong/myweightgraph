import test from 'node:test';
import assert from 'node:assert/strict';
import {FRAME_SAFE_INSET_V2,PROFILE_VISUAL_SCALE_V2,profileVisualV2,renderProfileEmojiV2} from '../js/showroom-v2.js';

const MYTHIC_PROFILE_IDS=[
  'pe_l_fallen_frost_prince','pe_l_tideglass_archmage','pe_l_ironjaw_warchief',
  'pe_l_raven_tower_guardian','pe_l_netherblade_betrayer','pe_l_dark_ranger_queen',
  'pe_l_worldsoul_stormcaller','pe_l_felskull_warlock','pe_l_red_dragon_lifequeen',
  'pe_l_cataclysm_black_dragon','pe13_m_tideborn_queen','pe13_m_sunwell_prince',
];

test('mythic portraits expose bounded per-asset scale calibration',()=>{
  assert.deepEqual(Object.keys(PROFILE_VISUAL_SCALE_V2).sort(),[...MYTHIC_PROFILE_IDS].sort());
  for(const id of MYTHIC_PROFILE_IDS){
    const scale=PROFILE_VISUAL_SCALE_V2[id];
    assert.ok(scale.full>=.86&&scale.full<=.99,`${id}: full`);
    assert.ok(scale.frame>=.9&&scale.frame<=1.03,`${id}: frame`);
    assert.ok(scale.bust>=1.32&&scale.bust<=1.48,`${id}: bust`);
    const html=renderProfileEmojiV2(id,116,'🙂','full');
    assert.match(html,new RegExp(`--portrait-full-scale:${scale.full}`));
    assert.match(html,new RegExp(`--portrait-frame-scale:${scale.frame}`));
    assert.match(html,new RegExp(`--portrait-bust-scale:${scale.bust}`));
  }
});

test('every collectible portrait frame has a bounded measured safe inset',()=>{
  assert.equal(Object.keys(FRAME_SAFE_INSET_V2).length,28);
  for(const [id,inset] of Object.entries(FRAME_SAFE_INSET_V2)){
    assert.ok(inset>=9&&inset<=18,`${id}: inset`);
    const html=profileVisualV2({profile_emoji:'pe_l_fallen_frost_prince',emoji_border:id},116,'🙂','showcase');
    assert.match(html,new RegExp(`data-frame-id="${id}"`));
    assert.match(html,new RegExp(`--portrait-frame-inset:${inset}%`));
  }
});
