import { DeleteOutlined } from '@ant-design/icons';
import { useDebounceFn } from 'ahooks';
import { Button, Empty, Flex, List, Select, Spin, Typography } from 'antd';
import type { FC } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { getMedicines } from '@/services/medicine';
import type { Medicine } from '@/services/medicine/typings.d';
import type { PrescriptionMedicationItem } from '@/services/patient-user/typings.d';

const { Title, Text } = Typography;

interface MedicationTreatmentProps {
  medications: PrescriptionMedicationItem[];
  onAdd: (item: PrescriptionMedicationItem) => void;
  onDelete: (id: string) => void;
}

const MedicationTreatment: FC<MedicationTreatmentProps> = ({
  medications,
  onAdd,
  onDelete,
}) => {
  const [options, setOptions] = useState<Medicine[]>([]);
  const [initialOptions, setInitialOptions] = useState<Medicine[]>([]);
  const initialLoadedRef = useRef(false);
  const [fetching, setFetching] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const selectedIds = useMemo(
    () => new Set(medications.map((m) => m.id)),
    [medications],
  );

  const handleDropdownOpen = useCallback(async (open: boolean) => {
    if (!open || initialLoadedRef.current) return;
    initialLoadedRef.current = true;
    try {
      const { data } = await getMedicines({ limit: 20 });
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
        const { data } = await getMedicines({ name: keyword, limit: 20 });
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
      const med = source.find((m) => m.id === value);
      if (med) {
        onAdd({ id: med.id, name: med.name, usage: med.usage ?? '' });
      }
      setSearchActive(false);
      setOptions([]);
    },
    [options, initialOptions, searchActive, onAdd],
  );

  const selectOptions = useMemo(
    () =>
      (searchActive ? options : initialOptions)
        .filter((m) => !selectedIds.has(m.id))
        .map((m) => ({ label: m.name, value: m.id })),
    [options, initialOptions, searchActive, selectedIds],
  );

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
        <Title level={5} style={{ margin: 0 }}>
          药物治疗
        </Title>
      </Flex>
      <Select<string>
        showSearch
        filterOption={false}
        placeholder="搜索药物名称添加…"
        value={undefined}
        options={selectOptions}
        onSearch={handleSearch}
        onSelect={handleSelect}
        onOpenChange={handleDropdownOpen}
        notFoundContent={fetching ? <Spin size="small" /> : undefined}
        style={{ width: '100%', marginBottom: 12 }}
        aria-label="搜索药物名称添加"
      />
      {medications.length > 0 ? (
        <List
          dataSource={medications}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="delete"
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={`删除${item.name}`}
                  onClick={() => onDelete(item.id)}
                />,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={`用法：${item.usage}`}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无药物" />
      )}
    </div>
  );
};

export default MedicationTreatment;
