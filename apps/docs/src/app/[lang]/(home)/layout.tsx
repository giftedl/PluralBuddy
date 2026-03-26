import { HomeLayout } from '@/components/layout/home';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/[lang]'>) {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>;
}
