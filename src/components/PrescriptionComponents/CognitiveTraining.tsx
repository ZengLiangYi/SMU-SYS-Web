import { DeleteOutlined } from '@ant-design/icons';
import { useDebounceFn } from 'ahooks';
import {
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Row,
  Select,
  Spin,
  Typography,
} from 'antd';
import type { FC } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { PrescriptionCognitiveItem } from '@/services/patient-user/typings.d';
import { getRehabLevels } from '@/services/rehab-level';
import type { RehabLevel } from '@/services/rehab-level/typings.d';

const { Title, Text } = Typography;

interface CognitiveTrainingProps {
  cards: PrescriptionCognitiveItem[];
  onAdd: (item: PrescriptionCognitiveItem) => void;
  onDelete: (id: string) => void;
}

const CognitiveTraining: FC<CognitiveTrainingProps> = ({
  cards,
  onAdd,
  onDelete,
}) => {
  const [options, setOptions] = useState<RehabLevel[]>([]);
  const [initialOptions, setInitialOptions] = useState<RehabLevel[]>([]);
  const initialLoadedRef = useRef(false);
  const [fetching, setFetching] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const selectedIds = useMemo(() => new Set(cards.map((c) => c.id)), [cards]);

  const handleDropdownOpen = useCallback(async (open: boolean) => {
    if (!open || initialLoadedRef.current) return;
    initialLoadedRef.current = true;
    try {
      const { data } = await getRehabLevels({ limit: 20 });
      setInitialOptions(data.items);
    } catch {
      // ignore — user can still search manually
    }
  }, []);

  const { run: handleSearch } = useDebounceFn(
    async (keyword: string) => {
      if (!keyword.trim()) {
        setSearchActive(false);
        setOptions([]);
        return;
      }
      setSearchActive(true);
      setFetching(true);
      try {
        const { data } = await getRehabLevels({ name: keyword, limit: 20 });
        setOptions(data.items);
      } catch {
        setOptions([]);
      } finally {
        setFetching(false);
      }
    },
    { wait: 400 },
  );

  const handleSelect = useCallback(
    (value: string) => {
      const source = searchActive ? options : initialOptions;
      const rehab = source.find((r) => r.id === value);
      if (rehab) {
        onAdd({
          id: rehab.id,
          name: rehab.name,
          levelType: rehab.level_type ?? '',
        });
      }
      setSearchActive(false);
      setOptions([]);
    },
    [options, initialOptions, searchActive, onAdd],
  );

  const selectOptions = useMemo(
    () =>
      (searchActive ? options : initialOptions)
        .filter((r) => !selectedIds.has(r.id))
        .map((r) => ({ label: r.name, value: r.id })),
    [options, initialOptions, searchActive, selectedIds],
  );

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
        <Title level={5} style={{ margin: 0 }}>
          认知训练
        </Title>
        <Text type="secondary">每日30分钟</Text>
      </Flex>
      <Select<string>
        showSearch
        filterOption={false}
        placeholder="搜索训练项目添加…"
        value={undefined}
        options={selectOptions}
        onSearch={handleSearch}
        onSelect={handleSelect}
        onOpenChange={handleDropdownOpen}
        notFoundContent={fetching ? <Spin size="small" /> : undefined}
        style={{ width: '100%', marginBottom: 12 }}
        aria-label="搜索训练项目添加"
      />
      {cards.length > 0 ? (
        <Row gutter={[16, 16]}>
          {cards.map((item) => (
            <Col span={12} key={item.id}>
              <Card size="small">
                <Flex justify="space-between" align="center">
                  <div>
                    <Text strong>{item.name}</Text>
                    <br />
                    <Text type="secondary">{item.levelType}</Text>
                  </div>
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    aria-label={`删除${item.name}`}
                    onClick={() => onDelete(item.id)}
                  />
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无训练项" />
      )}
    </div>
  );
};

export default CognitiveTraining;
