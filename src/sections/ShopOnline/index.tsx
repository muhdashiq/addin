import { useId, useMemo, useReducer, useRef } from 'react';
import buttonStyles from '../../components/Button.module.css';
import { MagneticButton } from '../../components/MagneticButton';
import { SectionHeader, SectionShell } from '../../components/SectionShell';
import { content } from '../../content/content';
import type { Business } from '../../content/types';
import {
  displayName,
  initialShopState,
  MAX_NAME_LENGTH,
  shopReducer,
  toSlug,
} from '../../features/shop/shopReducer';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { cx } from '../../lib/cx';
import { gsap, useGSAP } from '../../lib/gsap';
import { ease } from '../../lib/motion';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import type { BeforeAfterSliderHandle } from './BeforeAfterSlider';
import { BusinessIcon } from './BusinessIcon';
import { OfflineScene, OnlineScene } from './ShopScenes';
import styles from './ShopOnline.module.css';

const STEP_SECONDS = 0.6;
const ALL_ONLINE = 0;

const { shop } = content;

function selectedBusiness(id: string): Business {
  const match = shop.businesses.find((business) => business.id === id) ?? shop.businesses[0];
  if (!match) throw new Error('content.shop.businesses must not be empty');
  return match;
}

async function fireConfetti(colors: string[]) {
  const { default: confetti } = await import('canvas-confetti');
  await confetti({
    particleCount: 110,
    spread: 80,
    origin: { y: 0.65 },
    colors,
    disableForReducedMotion: true,
  });
}

export default function ShopOnline() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<BeforeAfterSliderHandle>(null);
  const reduced = usePrefersReducedMotion();
  const nameFieldId = useId();
  const nameHelpId = useId();

  const firstBusiness = shop.businesses[0];
  if (!firstBusiness) throw new Error('content.shop.businesses must not be empty');
  const [state, dispatch] = useReducer(shopReducer, firstBusiness.id, initialShopState);

  const business = selectedBusiness(state.businessId);
  const name = displayName(state, business);
  const domain = useMemo(
    () => `www.${toSlug(name, shop.fallbackSlug)}${shop.domainSuffix}`,
    [name],
  );

  const { contextSafe } = useGSAP({ scope: sectionRef });

  const deploy = contextSafe(() => {
    if (state.status === 'deploying') return;
    dispatch({ type: 'startDeploy' });

    const finish = () => {
      dispatch({ type: 'finishDeploy' });
      sliderRef.current?.slideTo(ALL_ONLINE);
      if (!reduced) void fireConfetti([business.colors.accent, business.colors.primary, '#ffffff']);
    };

    if (reduced) {
      finish();
      return;
    }

    const timeline = gsap.timeline({ onComplete: finish });
    timeline.fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: shop.deploySteps.length * STEP_SECONDS, ease: ease.linear },
    );
    shop.deploySteps.slice(1).forEach((_, index) => {
      timeline.call(() => dispatch({ type: 'advanceStep' }), undefined, (index + 1) * STEP_SECONDS);
    });
  });

  const reset = () => {
    dispatch({ type: 'reset' });
    gsap.set(progressRef.current, { scaleX: 0 });
  };

  const deploying = state.status === 'deploying';

  return (
    <SectionShell
      ref={sectionRef}
      id="shop"
      world="hinge"
      era="holo"
      bleedFrom="paper"
      className={styles.shop}
    >
      <SectionHeader id="shop" number={shop.number} title={shop.title} lead={shop.lead} />
      <p className={styles.notice}>{shop.demoNotice}</p>

      <div className={styles.layout}>
        <div className={styles.controls}>
          <fieldset className={styles.chips}>
            <legend>{shop.chooseLabel}</legend>
            <div className={styles.chipRow}>
              {shop.businesses.map((option) => (
                <label
                  key={option.id}
                  className={cx(styles.chip, option.id === state.businessId && styles.chipOn)}
                >
                  <input
                    type="radio"
                    name="business"
                    className="sr-only"
                    checked={option.id === state.businessId}
                    onChange={() => dispatch({ type: 'selectBusiness', id: option.id })}
                  />
                  <BusinessIcon id={option.id} size={18} />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.field}>
            <label htmlFor={nameFieldId}>{shop.nameLabel}</label>
            <input
              id={nameFieldId}
              type="text"
              value={state.customName}
              maxLength={MAX_NAME_LENGTH}
              placeholder={shop.namePlaceholder}
              autoComplete="off"
              aria-describedby={nameHelpId}
              onChange={(event) => dispatch({ type: 'setName', name: event.target.value })}
            />
            <small id={nameHelpId}>{shop.nameHelp}</small>
          </div>

          <div className={styles.deploy}>
            {state.status === 'live' ? (
              <button type="button" className={buttonStyles.button} onClick={reset}>
                {shop.deployAgainLabel}
              </button>
            ) : (
              <MagneticButton onClick={deploy} aria-disabled={deploying}>
                {deploying ? shop.deployingLabel : shop.deployLabel}
              </MagneticButton>
            )}

            <div className={styles.progressTrack} data-active={deploying} aria-hidden="true">
              <div ref={progressRef} className={styles.progress} />
            </div>

            <div className={styles.status} role="status" aria-live="polite">
              {deploying && <p>{shop.deploySteps[state.stepIndex]}</p>}
              {state.status === 'live' && (
                <>
                  <p className={styles.live}>{shop.liveMessage}</p>
                  <p className={styles.liveDetail}>{shop.liveDetail}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <BeforeAfterSlider
          ref={sliderRef}
          label={shop.sliderLabel}
          beforeLabel={shop.offlineLabel}
          afterLabel={shop.onlineLabel}
          before={<OfflineScene business={business} name={name} />}
          after={<OnlineScene business={business} name={name} domain={domain} />}
        />
      </div>
    </SectionShell>
  );
}
