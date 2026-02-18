'use client';
import { useState } from 'react';
import { 
    Stack, Paper, Text, Group, Button, 
    Grid, Box, Flex, TextInput, Checkbox, 
    ActionIcon, Tooltip, Badge, SimpleGrid
} from '@mantine/core';
import { 
    MagnifyingGlass, 
    Funnel, 
    Trash, 
    Plus,
    CheckCircle
} from '@phosphor-icons/react';
import styles from './RoleManagement.module.scss';

interface Role {
    id: number;
    name: string;
    permissions: string[];
    canView: boolean;
    canEdit: boolean;
}

const PERMISSIONS_LIST = [
    'Dashboards', 'Players', 'Games', 'Transactions', 'Bonus', 
    'Risk Management', 'Affiliate Program', 'Jackpots', 
    'Chat&Support', 'Analytics', 'Role Management', 'News', 'Safety'
];

export default function RoleManagement() {
    const [roles, setRoles] = useState<Role[]>([
        { id: 1, name: 'Main Admin', permissions: PERMISSIONS_LIST, canView: true, canEdit: true }
    ]);
    const [search, setSearch] = useState('');

    const addNewRole = () => {
        const newRole: Role = {
            id: Date.now(),
            name: 'New Role',
            permissions: [],
            canView: true,
            canEdit: false
        };
        setRoles([...roles, newRole]);
    };

    const deleteRole = (id: number) => setRoles(roles.filter(r => r.id !== id));
    
    const updateRoleName = (id: number, newName: string) => 
        setRoles(roles.map(r => r.id === id ? { ...r, name: newName } : r));

    const togglePermission = (roleId: number, perm: string) => {
        setRoles(roles.map(role => {
            if (role.id === roleId) {
                const hasPerm = role.permissions.includes(perm);
                return {
                    ...role,
                    permissions: hasPerm ? role.permissions.filter(p => p !== perm) : [...role.permissions, perm]
                };
            }
            return role;
        }));
    };

    const toggleAccess = (roleId: number, type: 'view' | 'edit') => {
        setRoles(roles.map(role => {
            if (role.id === roleId) {
                return type === 'view' ? { ...role, canView: !role.canView } : { ...role, canEdit: !role.canEdit };
            }
            return role;
        }));
    };

    return (
        <Stack gap="md" p={{ base: 'sm', sm: 'md', lg: 'xl' }} className={styles.pageWrapper}>
            
            {/* FILTER BAR - Более компактный */}
            <Paper className={styles.filterBar} p="sm" radius="md">
                <Flex 
                    direction={{ base: 'column', sm: 'row' }} 
                    justify="space-between" 
                    align={{ base: 'stretch', sm: 'center' }} 
                    gap="sm"
                >
                    <TextInput 
                        placeholder="Search roles..." 
                        leftSection={<MagnifyingGlass size={16} weight="bold" />}
                        className={styles.searchInput}
                        size="sm"
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                    />
                    <Group gap="xs">
                        <Button variant="light" color="gray" size="sm" leftSection={<Funnel size={16} />}>
                            Filter
                        </Button>
                        <Button 
                            color="blue" size="sm" 
                            leftSection={<Plus size={16} weight="bold" />}
                            onClick={addNewRole}
                        >
                            Create Role
                        </Button>
                    </Group>
                </Flex>
            </Paper>

            {/* ROLES CONTAINER */}
            <Paper className={styles.mainContainer} radius="md">
                {/* Desktop Header */}
                <Box visibleFrom="md" className={styles.tableHeader} p="sm">
                    <Grid gutter={0} align="center">
                        <Grid.Col span={3}><Text fz="xs" fw={700} tt="uppercase" ta="center" c="dimmed">Role Name</Text></Grid.Col>
                        <Grid.Col span={5}><Text fz="xs" fw={700} tt="uppercase" c="dimmed">Permissions</Text></Grid.Col>
                        <Grid.Col span={2}><Text fz="xs" fw={700} tt="uppercase" c="dimmed">Access</Text></Grid.Col>
                        <Grid.Col span={2}><Text fz="xs" fw={700} tt="uppercase" ta="center" c="dimmed">Actions</Text></Grid.Col>
                    </Grid>
                </Box>

                {/* Role Rows */}
                <Stack gap={0}>
                    {roles
                      .filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
                      .map((role) => (
                        <Box key={role.id} className={styles.roleRow} p={{ base: 'md', md: 'sm' }}>
                            <Grid gutter={{ base: 'md', md: 0 }} align="flex-start">
                                
                                {/* 1. Name */}
                                <Grid.Col span={{ base: 12, md: 3 }}>
                                    <Stack align="center" gap={4}>
                                        <TextInput 
                                            variant="unstyled" 
                                            value={role.name} 
                                            onChange={(e) => updateRoleName(role.id, e.currentTarget.value)}
                                            className={styles.roleNameField} 
                                        />
                                        <Badge variant="dot" size="xs" color="blue">
                                            {role.permissions.length} Active
                                        </Badge>
                                    </Stack>
                                </Grid.Col>

                                {/* 2. Permissions */}
                                <Grid.Col span={{ base: 12, md: 5 }}>
                                    <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xs" px={{ md: 'md' }}>
                                        {PERMISSIONS_LIST.map(perm => (
                                            <Checkbox 
                                                key={perm} label={perm} 
                                                checked={role.permissions.includes(perm)}
                                                onChange={() => togglePermission(role.id, perm)}
                                                size="xs"
                                                className={styles.permissionCheckbox}
                                            />
                                        ))}
                                    </SimpleGrid>
                                </Grid.Col>

                                {/* 3. Access */}
                                <Grid.Col span={{ base: 12, md: 2 }}>
                                    <Stack gap={6} mt={4}>
                                        <Checkbox label="Viewing" checked={role.canView} onChange={() => toggleAccess(role.id, 'view')} size="xs" color="blue" />
                                        <Checkbox label="Editing" checked={role.canEdit} onChange={() => toggleAccess(role.id, 'edit')} size="xs" color="blue" />
                                    </Stack>
                                </Grid.Col>

                                {/* 4. Actions */}
                                <Grid.Col span={{ base: 12, md: 2 }}>
                                    <Flex justify="center" align="center" gap="xs" h="100%">
                                        <Tooltip label="Save" position="top">
                                            <ActionIcon variant="light" color="green" size="md">
                                                <CheckCircle size={18} weight="bold" />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="Delete" color="red" position="top">
                                            <ActionIcon variant="subtle" color="red" size="md" onClick={() => deleteRole(role.id)}>
                                                <Trash size={18} weight="bold" />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Flex>
                                </Grid.Col>
                            </Grid>
                        </Box>
                    ))}
                </Stack>

                <Button 
                    fullWidth variant="transparent" 
                    leftSection={<Plus size={18} weight="bold" />}
                    className={styles.tableFooter}
                    onClick={addNewRole}
                    size="sm"
                >
                    ADD NEW ROLE
                </Button>
            </Paper>
        </Stack>
    );
}