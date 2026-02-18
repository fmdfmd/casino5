'use client';

import { useState } from 'react';
import { 
    Stack, Paper, Text, Group, Button, 
    Grid, Box, Badge, Divider, Title, 
    Table, ScrollArea, Avatar, SimpleGrid 
} from '@mantine/core';
import { 
    Check, 
    Trash, 
    LinkSimple, 
    TrendUp, 
    UsersThree,
    CurrencyDollar,
    Receipt,
    Wallet,
    Handshake,
    Envelope
} from '@phosphor-icons/react';
import styles from './Affiliate.module.scss';

interface Application {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    source: string;
    url: string;
    regions: string[];
    motivation: string;
}

export default function AffiliateAdminPage() {
    const [applications, setApplications] = useState<Application[]>([
        {
            id: 1,
            email: 'crypto.pro@gmail.com',
            firstName: 'Alexander',
            lastName: 'Vasiliev',
            source: 'Telegram Channel',
            url: 't.me/cryptopump_daily',
            regions: ['Russia', 'Kazakhstan'],
            motivation: 'I have 50k active subscribers interested in high-risk investments. Conversion rate is high.'
        },
        {
            id: 2,
            email: 'm.jenkins@leads.net',
            firstName: 'Sarah',
            lastName: 'Jenkins',
            source: 'SEO Website',
            url: 'best-betting-2026.com',
            regions: ['UK', 'Canada', 'Brazil'],
            motivation: 'Professional SEO team. We rank #1 for "crypto casino" in several regions.'
        },
        {
            id: 3,
            email: 'traff.boss@media.io',
            firstName: 'Dmitry',
            lastName: 'Kozlov',
            source: 'Facebook Ads',
            url: 'fb.com/groups/arbitrage',
            regions: ['CIS'],
            motivation: 'Spending $5k/daily on gambling traffic. Looking for direct advertiser.'
        }
    ]);

    const handleApprove = (id: number) => {
        alert(`Application #${id} Approved`);
        setApplications(applications.filter(a => a.id !== id));
    };

    return (
        <Box className={styles.pageWrapper} p={{ base: 'md', lg: 'xl' }}>
            <Stack gap="xl">
                
                {/* --- HEADER & STATS --- */}
                <FlexHeader applicationsCount={applications.length} />

                <Divider opacity={0.05} />

                {/* --- NEW APPLICATIONS GRID (Equal height & width) --- */}
                <Box>
                    <Group mb="lg" gap="xs">
                        <Handshake size={24} color="#3b82f6" weight="duotone" />
                        <Title order={3} c="white">Pending Applications</Title>
                    </Group>

                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                        {applications.map((app) => (
                            <Paper key={app.id} className={styles.appCard} p="xl">
                                <Box className={styles.cardBody}>
                                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                                        <Group gap="md" wrap="nowrap">
                                            <Avatar radius="md" color="blue" size="lg">{app.firstName[0]}</Avatar>
                                            <Box style={{ overflow: 'hidden' }}>
                                                <Text fw={800} fz="md" c="white" truncate>{app.firstName} {app.lastName}</Text>
                                                <Group gap={6} wrap="nowrap">
                                                    <Envelope size={14} color="#94a3b8" />
                                                    <Text fz="xs" c="dimmed" truncate>{app.email}</Text>
                                                </Group>
                                            </Box>
                                        </Group>
                                        <Badge variant="light" color="blue" size="sm">{app.source.split(' ')[0]}</Badge>
                                    </Group>

                                    <SimpleGrid cols={2} spacing="xs">
                                        <Box>
                                            <Text fz="10px" c="dimmed" mb={2} tt="uppercase" fw={800}>Source</Text>
                                            <Group gap={4} wrap="nowrap">
                                                <LinkSimple size={12} color="#3b82f6" />
                                                <Text fz="xs" c="blue.3" truncate fw={600}>{app.url}</Text>
                                            </Group>
                                        </Box>
                                        <Box>
                                            <Text fz="10px" c="dimmed" mb={2} tt="uppercase" fw={800}>Regions</Text>
                                            <Text fz="xs" c="white" truncate>{app.regions.join(', ')}</Text>
                                        </Box>
                                    </SimpleGrid>

                                    <Box>
                                        <Text fz="10px" c="dimmed" mb={4} tt="uppercase" fw={800}>Motivation</Text>
                                        <Box className={styles.motivationBox}>
                                            {app.motivation}
                                        </Box>
                                    </Box>
                                </Box>

                                <Group grow gap="md" mt="xl">
                                    <Button 
                                        variant="light" color="green" size="sm"
                                        leftSection={<Check size={16} weight="bold" />}
                                        onClick={() => handleApprove(app.id)}
                                    >
                                        Approve
                                    </Button>
                                    <Button variant="subtle" color="red" size="sm" leftSection={<Trash size={16} />}>
                                        Reject
                                    </Button>
                                </Group>
                            </Paper>
                        ))}
                    </SimpleGrid>
                </Box>

                {/* --- ACTIVE PARTNERS TABLE --- */}
                <SectionTable 
                    title="Active Partners" 
                    icon={<TrendUp size={24} color="#10b981" weight="duotone" />} 
                >
                    <Table verticalSpacing="md">
                        <Table.Thead className={styles.tableHeader}>
                            <Table.Tr>
                                <Table.Th>Partner</Table.Th>
                                <Table.Th>Company</Table.Th>
                                <Table.Th>Players</Table.Th>
                                <Table.Th>Net Profit</Table.Th>
                                <Table.Th>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr className={styles.tableRow}>
                                <Table.Td><Text fw={700} fz="sm">Max Power</Text></Table.Td>
                                <Table.Td><Text fz="xs" c="dimmed">Traffic Hub</Text></Table.Td>
                                <Table.Td><Text fw={700} fz="sm">1,240</Text></Table.Td>
                                <Table.Td><Text fw={800} c="green.4" fz="sm">$42,000</Text></Table.Td>
                                <Table.Td><Badge color="green" variant="dot" size="sm">Active</Badge></Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </SectionTable>

                {/* --- PAYOUT HISTORY --- */}
                <SectionTable 
                    title="Payout History" 
                    icon={<Receipt size={24} color="#eab308" weight="duotone" />} 
                >
                    <Table verticalSpacing="md">
                        <Table.Thead className={styles.tableHeader}>
                            <Table.Tr>
                                <Table.Th>Company</Table.Th>
                                <Table.Th>Amount</Table.Th>
                                <Table.Th>Method / Wallet</Table.Th>
                                <Table.Th>Date</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr className={styles.tableRow}>
                                <Table.Td><Text fw={700} fz="sm">Traffic Hub</Text></Table.Td>
                                <Table.Td><Text fw={800} c="green.4" fz="sm">$12,500</Text></Table.Td>
                                <Table.Td>
                                    <Stack gap={2}>
                                        <Text fz="10px" fw={800} c="blue.3">USDT ERC20</Text>
                                        <Text className={styles.cryptoAddress}>0x71C...3aE4</Text>
                                    </Stack>
                                </Table.Td>
                                <Table.Td><Text fz="xs" c="dimmed">04.01.2026</Text></Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </SectionTable>

            </Stack>
        </Box>
    );
}

// Вспомогательные компоненты для чистоты кода
function FlexHeader({ applicationsCount }: { applicationsCount: number }) {
    return (
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <Stack gap={0}>
                <Title order={1} c="white" fz={{ base: '22px', sm: '28px' }}>Partnership Hub</Title>
                <Text c="dimmed" fz="xs">Manage applications and company payouts</Text>
            </Stack>
            <Group gap="sm">
                <StatCard icon={<UsersThree size={20} color="#3b82f6" />} label="New" value={applicationsCount} />
                <StatCard icon={<CurrencyDollar size={20} color="#10b981" />} label="Paid" value="$17.5k" />
            </Group>
        </Group>
    );
}

function StatCard({ icon, label, value }: any) {
    return (
        <Paper className={styles.card} px="md" py="xs">
            <Group gap="xs">
                {icon}
                <Box>
                    <Text size="10px" c="dimmed" fw={800} tt="uppercase">{label}</Text>
                    <Text fw={800} fz="sm">{value}</Text>
                </Box>
            </Group>
        </Paper>
    );
}

function SectionTable({ title, icon, children }: any) {
    return (
        <Box mt="sm">
            <Group mb="md" gap="xs">
                {icon}
                <Title order={4} c="white">{title}</Title>
            </Group>
            <Paper className={styles.card} p="md">
                <ScrollArea>{children}</ScrollArea>
            </Paper>
        </Box>
    );
}