/**
 * IRON BARRICADE - Shop (cosmetic only)
 * Structure ready for future skins / cosmetics.
 */

const SHOP_ITEMS = [
  { id: 'skin_bolt_neon', name: 'Canhão Neon', cost: 500, type: 'skin', defender: 'boltCannon' },
  { id: 'skin_wall_military', name: 'Muro Militar', cost: 300, type: 'skin', defender: 'tireWall' },
  { id: 'fx_sparks_gold', name: 'Faíscas Douradas', cost: 400, type: 'fx' }
];

class ShopManager {
  getItems() { return SHOP_ITEMS; }
  canBuy(id) {
    const item = SHOP_ITEMS.find(i => i.id === id);
    return item && Save.data.resources.scrap >= item.cost;
  }
  buy(id) {
    const item = SHOP_ITEMS.find(i => i.id === id);
    if (!item || !this.canBuy(id)) return false;
    const owned = Save.data.cosmetics.owned || (Save.data.cosmetics.owned = []);
    if (owned.includes(id)) return false;
    Save.data.resources.scrap -= item.cost;
    owned.push(id);
    Save.autoSave();
    return true;
  }
  isOwned(id) { return (Save.data.cosmetics.owned || []).includes(id); }
}

const Shop = new ShopManager();
