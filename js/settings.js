/**
 * IRON BARRICADE - Settings helpers
 * Main logic is in UI and Save.
 */

function applyQuality(quality) {
  if (quality === 'low') {
    Particles.setEnabled(false);
  } else {
    Particles.setEnabled(Save.data.settings.particles);
  }
}
