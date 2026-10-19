'use client';

import { type ComponentProps, createContext, type FC, use } from 'react';
import type { BaseLayoutProps, LinkItemType, NavOptions } from '@/components/layouts/shared';
import { type BaseSlots, type BaseSlotsProps, baseSlots, useLinkItems } from '@/components/layouts/shared';
import { Container } from './slots/container';
import { Header } from './slots/header';

export interface HomeLayoutProps extends BaseLayoutProps, ComponentProps<'main'> {
  nav?: Nav;
  slots?: Partial<HomeSlots>;
  fixedMode?: boolean;
}

interface Nav extends NavOptions {
  /**
   * Open mobile menu when hovering the trigger
   */
  enableHoverToOpen?: boolean;
}

export interface HomeSlots extends BaseSlots {
  header: FC<ComponentProps<'header'> & { fixedMode: boolean }>;
  container: FC<ComponentProps<'main'>>;
}

const LayoutContext = createContext<{
  props: BaseSlotsProps<HomeLayoutProps>;
  navItems: LinkItemType[];
  menuItems: LinkItemType[];
  slots: HomeSlots;
} | null>(null);

export function useHomeLayout() {
  const context = use(LayoutContext);
  if (!context)
    throw new Error('Please use this component under <HomeLayout /> (`fumadocs-ui/layouts/home`).');
  return context;
}

const { useBaseSlots } = baseSlots({
  useProps() {
    return useHomeLayout().props;
  },
});

export function HomeLayout(props: HomeLayoutProps = { fixedMode: false }) {
  const {
    nav: { enabled: navEnabled = true } = {},
    slots: defaultSlots,
    children,
    i18n: _i18n,
    githubUrl: _githubUrl,
    links: _links,
    themeSwitch: _themeSwitch,
    searchToggle: _searchToggle,
    fixedMode,
    ...rest
  } = props;
  const { baseSlots, baseProps } = useBaseSlots(props);
  const linkItems = useLinkItems(props);
  const slots: HomeSlots = {
    ...baseSlots,
    header: defaultSlots?.header ?? InlineHeader,
    container: defaultSlots?.container ?? Container,
  };

  return (
    <LayoutContext
      value={{
        props: baseProps,
        slots,
        ...linkItems,
      }}
    >
      <slots.container {...rest}>
        {navEnabled && <slots.header fixedMode={fixedMode ?? false} />}
        {children}
      </slots.container>
    </LayoutContext>
  );
}

function InlineHeader(props: ComponentProps<'header'> & { fixedMode: boolean }) {
  const { nav } = useHomeLayout().props;
  if (nav?.component) return nav.component;
  return <Header {...props} />;
}
