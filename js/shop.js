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
    // Placeholder - cosmetics only, no gameplay impact
    return false;
  }
}

const Shop = new ShopManager();
