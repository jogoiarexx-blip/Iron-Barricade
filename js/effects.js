/**
 * IRON BARRICADE - Visual Effects & Screen FX
 */

class EffectsManager {
  constructor() {
    this.shakeAmount = 0;
    this.shakeDecay = 0.9;
    this.flashAlpha = 0;
    this.flashColor = '#ffffff';
    this.alerts = [];
    this.damageNumbers = [];
  }

  screenShake(amount = 5) {
    this.shakeAmount = Math.max(this.shakeAmount, amount);
  }

  flash(color = '#ffffff', alpha = 0.3) {
    this.flashColor = color;
    this.flashAlpha = alpha;
  }

  showAlert(text, duration = 2500) {
    this.alerts.push({ text, life: duration / 1000, maxLife: duration / 1000 });
    Audio.playSfx('alert');
  }

  spawnDamageNumber(x, y, amount, isCrit = false) {
    if (!Save.data.settings.damageNumbers) return;
    this.damageNumbers.push({
      x, y,
      text: isCrit ? `CRÍTICO ${amount}` : `${amount}`,
      life: 0.8,
      isCrit,
      vy: -40
    });
  }

  update(dt) {
    this.shakeAmount *= this.shakeDecay;
    if (this.shakeAmount < 0.1) this.shakeAmount = 0;

    this.flashAlpha *= 0.92;
    if (this.flashAlpha < 0.01) this.flashAlpha = 0;

    for (let i = this.alerts.length - 1; i >= 0; i--) {
      this.alerts[i].life -= dt;
      if (this.alerts[i].life <= 0) this.alerts.splice(i, 1);
    }

    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const d = this.damageNumbers[i];
      d.y += d.vy * dt;
      d.life -= dt;
      if (d.life <= 0) this.damageNumbers.splice(i, 1);
    }
  }

  getShakeOffset() {
    if (this.shakeAmount <= 0) return { x: 0, y: 0 };
    return {
      x: (Math.random() - 0.5) * this.shakeAmount * 2,
      y: (Math.random() - 0.5) * this.shakeAmount * 2
    };
  }

  drawOverlay(ctx, w, h) {
    if (this.flashAlpha > 0) {
      ctx.globalAlpha = this.flashAlpha;
      ctx.fillStyle = this.flashColor;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    // Alerts
    for (const a of this.alerts) {
      const alpha = Math.min(1, a.life * 2, a.maxLife - a.life > 0.3 ? 1 : a.life / 0.3);
      ctx.globalAlpha = alpha;
      ctx.font = 'bold 28px Orbitron, sans-serif';
      ctx.fillStyle = '#ff3344';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 15;
      ctx.fillText(a.text, w / 2, h * 0.25);
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // Damage numbers
    for (const d of this.damageNumbers) {
      ctx.globalAlpha = Math.min(1, d.life * 2);
      ctx.font = d.isCrit ? 'bold 18px Orbitron' : 'bold 14px Orbitron';
      ctx.fillStyle = d.isCrit ? '#ffcc00' : '#ffffff';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText(d.text, d.x, d.y);
      ctx.fillText(d.text, d.x, d.y);
      ctx.globalAlpha = 1;
    }
  }
}

const Effects = new EffectsManager();
