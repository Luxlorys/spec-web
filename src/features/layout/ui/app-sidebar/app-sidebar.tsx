'use client';

import { FC } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  BookOpen,
  ChevronUp,
  Home,
  LogOut,
  Settings,
  Sparkles
} from 'lucide-react';

import { authApi } from 'shared/api/auth';
import { useAuthStore } from 'shared/store';
import { getFullName } from 'shared/types';
import { Avatar, Button } from 'shared/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'shared/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from 'shared/ui/sidebar';

const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Documentation',
    url: '/documentation',
    icon: BookOpen,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export const AppSidebar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  const handleLogout = () => {
    authApi.logout();
    router.push('/login');
  };

  const userName = user ? getFullName(user) : '';
  const userRole = user?.role ?? null;
  const userOrg = user?.organization ?? null;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold">SpecFlow</span>
            <span className="text-xs text-muted-foreground">
              {userOrg?.name ?? 'Personal'}
            </span>
          </div>
        </Link>

        <Link href="/features/new" className="mt-4">
          <Button className="items-center justify-start gap-2">
            <Sparkles className="h-4 w-4 text-white" />
            Feature Request
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(item => {
                const isActive =
                  pathname === item.url || pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {user && (
                    <>
                      <Avatar
                        src={user.avatarUrl ?? undefined}
                        alt={userName}
                        size="sm"
                      />
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {userName}
                        </span>
                        <span className="truncate text-xs capitalize text-muted-foreground">
                          {userRole?.toLowerCase()}
                        </span>
                      </div>
                      <ChevronUp className="ml-auto h-4 w-4" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
