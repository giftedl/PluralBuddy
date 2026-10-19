'use client';
import { useTranslations } from '@fuma-translate/react';
import { useI18n } from '@fumadocs/base-ui/contexts/i18n';
import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/shadcn-button';
import { cn } from '@/lib/cn';
import { setLocale } from '@/paraglide/runtime';

export interface LanguageSelectProps extends ComponentProps<'button'> {
  variant?: VariantProps<typeof buttonVariants>['variant'];
}

export function LanguageSelect({
  className,
  variant = 'ghost',
  children,
  ...rest
}: LanguageSelectProps): React.ReactElement {
  const context = useI18n();
  const t = useTranslations({ note: 'language switcher' });
  if (!context.locales) throw new Error('Missing `<I18nProvider />`');

  const chooseLanguage = t('Choose a language');

  return (
    <Popover>
      <PopoverTrigger
        aria-label={t('Choose a language', { note: 'aria-label' })}

        className={cn(
          buttonVariants({ size: "icon-sm", color: variant }),
          "cursor-pointer")}
        {...rest}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-0.5 p-1">
        <p className="p-2 text-xs font-medium text-fd-muted-foreground">{chooseLanguage}</p>
        {context.locales.map((item) => (
          <button
            key={item.locale}
            type="button"
            className={cn(
              'px-2 py-1.5 text-start text-sm rounded-lg transition-colors',
              item.locale === context.locale
                ? 'bg-fd-primary/10 text-fd-primary'
                : 'text-fd-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
            onClick={() => {
              // context.onChange?.(item.locale);
              setLocale(item.locale as "en")
            }}
          >
            {item.name}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export type LanguageSelectTextProps = ComponentProps<'span'>;

export function LanguageSelectText(props: LanguageSelectTextProps) {
  const { locales, locale } = useI18n();
  const text = locales?.find((item) => item.locale === locale)?.name;

  return <span {...props}>{text}</span>;
}
