import { memo } from 'react';
import type { CSSProperties } from 'react';
import { content } from '../../content/content';
import type { Business } from '../../content/types';
import { BusinessIcon } from './BusinessIcon';
import styles from './ShopScenes.module.css';

interface SceneProps {
  business: Business;
  name: string;
  domain: string;
}

type BrandStyle = CSSProperties & {
  '--shop-primary': string;
  '--shop-accent': string;
  '--shop-tint': string;
};

const brandStyle = ({ colors }: Business): BrandStyle => ({
  '--shop-primary': colors.primary,
  '--shop-accent': colors.accent,
  '--shop-tint': colors.tint,
});

export const OfflineScene = memo(function OfflineScene({
  business,
  name,
}: Omit<SceneProps, 'domain'>) {
  return (
    <div
      className={styles.offline}
      style={brandStyle(business)}
      role="img"
      aria-label={content.shop.offlineAlt}
    >
      <div className={styles.signboard}>
        <span className={styles.signName}>{name}</span>
        <span className={styles.signTagline}>{business.tagline}</span>
      </div>
      <p className={styles.wallPhone}>{business.phone}</p>
      <div className={styles.ledger}>
        <ul>
          {business.ledger.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export const OnlineScene = memo(function OnlineScene({ business, name, domain }: SceneProps) {
  const { shop } = content;
  return (
    <div
      className={styles.online}
      style={brandStyle(business)}
      role="img"
      aria-label={shop.onlineAlt}
    >
      <div className={styles.browser}>
        <div className={styles.browserBar}>
          <span className={styles.browserDots} />
          <span className={styles.address}>{domain}</span>
        </div>
        <div className={styles.site}>
          <div className={styles.siteNav}>
            <span className={styles.siteBrand}>
              <BusinessIcon id={business.id} size={18} />
              <span className={styles.truncate}>{name}</span>
            </span>
            <span className={styles.siteLinks}>
              {shop.mockNav.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </span>
          </div>
          <div className={styles.siteHero}>
            <h4 className={styles.siteTitle}>{name}</h4>
            <p>{business.tagline}</p>
            <span className={styles.siteButtons}>
              <span className={styles.sitePrimary}>{shop.mockCall}</span>
              <span className={styles.siteSecondary}>{shop.mockFind}</span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.phone}>
        <div className={styles.phoneBar}>
          <span>3G</span>
          <span>2010</span>
        </div>
        <div className={styles.appHeader}>
          <BusinessIcon id={business.id} size={16} />
          <span className={styles.truncate}>{name}</span>
        </div>
        <div className={styles.appBody}>
          <span className={styles.appIcon}>
            <BusinessIcon id={business.id} size={30} />
          </span>
          <span className={styles.appAction}>{business.appAction}</span>
          <span className={styles.appInstalled}>{shop.appInstalled}</span>
        </div>
      </div>
    </div>
  );
});
