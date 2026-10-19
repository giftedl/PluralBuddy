import { HomeLayout } from '@/components/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return <HomeLayout {...baseOptions()} fixedMode id="pb-fun-scrollbar">{children}</HomeLayout>;
}
