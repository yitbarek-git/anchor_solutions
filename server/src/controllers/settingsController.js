import { getStore } from '../database/db.js';

export class SettingsController {
  static getSettings(req, res, next) {
    try {
      const store = getStore();
      res.json({
        success: true,
        data: store.site_settings,
      });
    } catch (err) {
      next(err);
    }
  }

  static getHomepage(req, res, next) {
    try {
      const store = getStore();
      const { lang = 'en' } = req.query;
      res.json({
        success: true,
        data: {
          brand: store.site_settings.brand_name[lang] || store.site_settings.brand_name.en,
          tagline: store.site_settings.brand_tagline[lang] || store.site_settings.brand_tagline.en,
          location: store.site_settings.office_location[lang] || store.site_settings.office_location.en,
          phones: [
            store.site_settings.phone_primary,
            store.site_settings.phone_secondary,
            store.site_settings.phone_tertiary,
            store.site_settings.phone_quaternary,
          ].filter(Boolean),
          social: {
            telegram: store.site_settings.telegram_url,
            facebook: store.site_settings.facebook_url,
            tiktok: store.site_settings.tiktok_url,
          },
          partner: store.site_settings.partner_institution[lang] || store.site_settings.partner_institution.en,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export default SettingsController;
