'use client';
import { 
    Stack, Paper, Title, Text, Group, Button, 
    TextInput, Textarea, Table, ScrollArea, 
    ActionIcon, Box, Grid, Badge, Flex
} from '@mantine/core';
import { 
    MagnifyingGlass, Funnel, ArrowBendUpLeft, 
    PencilSimple, Trash, Image as ImageIcon,
    CalendarBlank, CalendarCheck
} from '@phosphor-icons/react';
import styles from './News.module.scss';

export default function NewsPage() {
    const newsData = [
        { id: '1234', name: 'BONUS HUNT', desc: 'Epic battle for all players now starting...', status: 'Active', add: '12/03/25', end: '12/03/25' },
        { id: '1235', name: 'JACKPOT WEEK', desc: 'Double your chances this week only...', status: 'Active', add: '12/03/25', end: '12/03/25' },
        { id: '1236', name: 'NEW PROVIDER', desc: 'Welcome our new slots collection...', status: 'Expired', add: '12/03/25', end: '12/03/25', expired: true },
    ];

    return (
        <Stack gap={{ base: 20, md: 40 }} p={{ base: 12, sm: 20, lg: 40 }} className={styles.pageWrapper}>
            
            {/* СЕКЦИЯ 1: ТАБЛИЦА ВСЕХ НОВОСТЕЙ */}
            <Paper className={styles.sectionPaper} p={{ base: 16, sm: 25, lg: 35 }}>
                <Group justify="space-between" mb={30} align="flex-end">
                    <Stack gap={4}>
                        <Title order={2} c="white" fz={{ base: 20, sm: 24, lg: 32 }} fw={900}>All news</Title>
                        <Text c="dimmed" fz="sm">Manage and monitor all your published materials</Text>
                    </Stack>
                </Group>

                <Grid gutter="md" mb={30}>
                    <Grid.Col span={{ base: 12, md: 10 }}>
                        <TextInput 
                            placeholder="Search news..." 
                            leftSection={<MagnifyingGlass size={20} />} 
                            className={styles.darkInput}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 2 }}>
                        <Button leftSection={<Funnel size={20} />} className={styles.blueBtn} fullWidth>
                            Filter
                        </Button>
                    </Grid.Col>
                </Grid>

                <ScrollArea scrollbars="x" type="auto" offsetScrollbars>
                    <Table className={styles.newsTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Banner</th>
                                <th>Status</th>
                                <th>Data add</th>
                                <th>Data end</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newsData.map((item, index) => (
                                <tr key={index}>
                                    <td><Text fw={700} c="white" span style={{ whiteSpace: 'nowrap' }}># {item.id}</Text></td>
                                    <td><Text fw={800} fz="sm" c="white" style={{ whiteSpace: 'nowrap' }}>{item.name}</Text></td>
                                    <td><Text fz="sm" c="dimmed" truncate w={200}>{item.desc}</Text></td>
                                    <td>
                                        <div className={styles.bannerCell}>
                                            <ImageIcon size={20} weight="fill" />
                                        </div>
                                    </td>
                                    <td>
                                        <Text fz="xs" c={item.expired ? '#5C7CFA' : '#0EA5E9'} fw={900} lts="1.2px">
                                            {item.status.toUpperCase()}
                                        </Text>
                                    </td>
                                    <td><Text fz="sm" style={{ whiteSpace: 'nowrap' }}>{item.add}</Text></td>
                                    <td><Text fz="sm" style={{ whiteSpace: 'nowrap' }}>{item.end}</Text></td>
                                    <td>
                                        <Group gap={8} justify="flex-end" wrap="nowrap">
                                            <ActionIcon variant="subtle" color="gray" size="lg"><ArrowBendUpLeft size={18} /></ActionIcon>
                                            <ActionIcon variant="subtle" color="blue" size="lg"><PencilSimple size={18} /></ActionIcon>
                                            <ActionIcon variant="subtle" color="red" size="lg"><Trash size={18} /></ActionIcon>
                                        </Group>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </ScrollArea>
            </Paper>

            {/* СЕКЦИЯ 2: СОЗДАНИЕ НОВОСТИ */}
            <Paper className={styles.sectionPaper} p={{ base: 16, sm: 25, lg: 40 }}>
                <Title order={2} c="white" mb={30} fz={{ base: 20, sm: 24, lg: 32 }} fw={900}>
                    Create Creative News
                </Title>
                
                <Grid gutter={{ base: 25, lg: 50 }}>
                    {/* Лево: Форма */}
                    <Grid.Col span={{ base: 12, lg: 6 }}>
                        <Stack gap={20}>
                            <Box>
                                <label className={styles.inputLabel}>News Header</label>
                                <TextInput 
                                    placeholder="Enter news title..." 
                                    className={styles.darkInput}
                                    leftSection={<PencilSimple size={18} weight="bold" />}
                                />
                            </Box>
                            
                            <Box>
                                <label className={styles.inputLabel}>Content Description</label>
                                <Textarea 
                                    placeholder="Provide detailed information..." 
                                    className={`${styles.darkInput} ${styles.textAreaCustom}`}
                                />
                            </Box>
                            
                            <Grid gutter="md">
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <label className={styles.inputLabel}>Publish Date</label>
                                    <TextInput 
                                        placeholder="DD / MM / YYYY" 
                                        className={styles.darkInput} 
                                        leftSection={<CalendarBlank size={18} weight="bold" />}
                                    />
                                </Grid.Col>
                                <Grid.Col span={{ base: 12, sm: 6 }}>
                                    <label className={styles.inputLabel}>Expiry Date</label>
                                    <TextInput 
                                        placeholder="DD / MM / YYYY" 
                                        className={styles.darkInput} 
                                        leftSection={<CalendarCheck size={18} weight="bold" />}
                                    />
                                </Grid.Col>
                            </Grid>

                            {/* Исправленные кнопки: Flex вместо Group grow */}
                            <Flex 
                                direction={{ base: 'column', sm: 'row' }} 
                                gap="md" 
                                mt={10}
                            >
                                <Button className={styles.blueBtn} fullWidth>Confirm & Publish</Button>
                                <Button className={styles.resetBtn} fullWidth>Reset Changes</Button>
                            </Flex>
                        </Stack>
                    </Grid.Col>

                    {/* Право: Загрузка баннера */}
                    <Grid.Col span={{ base: 12, lg: 6 }}>
                        <Box h="100%">
                            <label className={styles.inputLabel}>Banner Preview</label>
                            <div className={styles.imageUploadBox}>
                                <Box mb={15} style={{ opacity: 0.3 }}>
                                    <ImageIcon size={60} weight="duotone" color="#0EA5E9" />
                                </Box>
                                <Stack gap={4} align="center">
                                    <Text c="white" fw={800} fz={{ base: 'md', sm: 'lg' }} textAlign="center">Upload Banner Image</Text>
                                    <Text c="dimmed" fz="xs" fw={500} textAlign="center">Drag and drop or click to browse</Text>
                                    <Group gap={8} mt={15} justify="center">
                                        <Badge variant="outline" color="gray" size="xs">PNG, JPG</Badge>
                                        <Badge variant="outline" color="gray" size="xs">MAX 10MB</Badge>
                                    </Group>
                                </Stack>
                            </div>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Paper>

        </Stack>
    );
}