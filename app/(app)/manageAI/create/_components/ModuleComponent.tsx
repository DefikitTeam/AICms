import React, { useState } from 'react';
import { Box, Flex, Switch, Text, Button } from '@radix-ui/themes';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { FieldValues } from 'react-hook-form';
import { Copy, ExternalLink, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu cho một trường cài đặt
export interface ModuleFieldSetting {
    name: string;  // Tên trường
    key: string;   // Key để lưu vào form data
    type: 'text' | 'password' | 'switch' | 'number'; // Loại field
    notice?: string; // Thông báo/ghi chú cho field
    defaultValue?: string | boolean | number; // Giá trị mặc định
    placeholder?: string; // Placeholder cho trường input
}

// Định nghĩa kiểu dữ liệu cho module
export interface ModuleConfigProps {
    name: string; // Tên module
    description: string; // Mô tả module
    iconColor: string; // Màu sắc của icon
    activeColor: string; // Màu sắc khi active
    icon: React.ReactNode; // Icon component
    fields: ModuleFieldSetting[]; // Các trường cài đặt
    isActive: boolean; // Trạng thái module (bật/tắt)
    onToggle: (checked: boolean) => void; // Hàm xử lý khi toggle module
    formPath: string; // Đường dẫn trong form data (e.g., "modules.education")
    control: Control<FieldValues>; // Control từ react-hook-form
    setValue?: UseFormSetValue<FieldValues>; // setValue từ react-hook-form
    agentId?: string; // ID của agent để tạo link
    linkPath?: string; // Đường dẫn cho link, ví dụ: "/xaicombat"
    hasLink?: boolean; // Có hiển thị phần link không
}

// Ánh xạ các màu tùy chỉnh sang màu được Radix UI hỗ trợ
const mapColorToRadix = (color: string): any => {
    const colorMap: Record<string, string> = {
        'red': 'red',
        'blue': 'blue',
        'green': 'green',
        'amber': 'amber',
        'purple': 'purple',
        'teal': 'teal',
        'orange': 'orange',
        'gray': 'gray'
    };

    // Trả về màu được ánh xạ hoặc 'gray' làm mặc định
    return colorMap[color] || 'gray';
};

const ModuleComponent: React.FC<ModuleConfigProps> = ({
    name,
    description,
    iconColor,
    activeColor,
    icon,
    fields,
    isActive,
    onToggle,
    formPath,
    control,
    setValue,
    agentId,
    linkPath = '/xaicombat',
    hasLink = false
}) => {
    // State for copy success message
    const [copied, setCopied] = useState(false);
    // State for configuration expansion
    const [showConfig, setShowConfig] = useState(false);
    // State for access section expansion
    const [showAccess, setShowAccess] = useState(false);

    // Hàm render field tùy theo type
    const renderField = (field: ModuleFieldSetting) => {
        const { name, key, type, notice, defaultValue, placeholder } = field;
        const fieldPath = `${formPath}.${key}`;

        switch (type) {
            case 'switch':
                return (
                    <Controller
                        name={fieldPath}
                        control={control}
                        defaultValue={defaultValue || false}
                        render={({ field: { onChange, value } }) => (
                            <Flex justify="between" align="center" className="w-full">
                                <Box>
                                    <Text weight="medium">{name}</Text>
                                    {notice && <Text size="1" color="gray">{notice}</Text>}
                                </Box>
                                <Switch
                                    checked={value}
                                    onCheckedChange={(checked) => {
                                        onChange(checked);
                                    }}
                                    size="2"
                                />
                            </Flex>
                        )}
                    />
                );

            case 'text':
            case 'password':
                return (
                    <Box className="w-full">
                        <Text size="1" as="label" className="mb-1 block">{name}</Text>
                        {notice && <Text size="1" color="gray" className="mb-1">{notice}</Text>}
                        <input
                            type={type}
                            placeholder={placeholder || `Enter ${name.toLowerCase()}`}
                            defaultValue={defaultValue as string || ''}
                            onChange={(e) => {
                                if (setValue) {
                                    setValue(fieldPath, e.target.value, { shouldValidate: true });
                                }
                            }}
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white"
                        />
                    </Box>
                );

            case 'number':
                return (
                    <Box className="w-full">
                        <Text size="1" as="label" className="mb-1 block">{name}</Text>
                        {notice && <Text size="1" color="gray" className="mb-1">{notice}</Text>}
                        <input
                            type="number"
                            placeholder={placeholder || `Enter ${name.toLowerCase()}`}
                            defaultValue={defaultValue as number || 0}
                            onChange={(e) => {
                                if (setValue) {
                                    setValue(fieldPath, Number(e.target.value), { shouldValidate: true });
                                }
                            }}
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white"
                        />
                    </Box>
                );

            default:
                return null;
        }
    };

    // Handle copy link function
    const handleCopyLink = (e: React.MouseEvent) => {
        // Ngăn chặn hành vi mặc định và lan truyền sự kiện
        e.preventDefault();
        e.stopPropagation();

        // Generate a link using the agent ID
        const link = `${window.location.origin}/${agentId}${linkPath}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Extract color name for text color
    const colorName = activeColor.replace('bg-', '').replace('-400', '');
    // Map to a Radix UI supported color
    const radixColor = mapColorToRadix(colorName);

    return (
        <Box className={`bg-white dark:bg-neutral-800 rounded-xl shadow-lg transition-all duration-300 transform hover:shadow-xl mb-6 ${isActive ? 'border-l-4 ' + activeColor.replace('bg', 'border') : ''}`}>
            {/* Header section with gradient */}
            <Box className={`p-5 rounded-t-xl ${isActive ? `bg-gradient-to-r from-${colorName}-50 to-transparent dark:from-${colorName}-900/30 dark:to-transparent` : ''}`}>
                {/* Centered icon at top */}
                <Flex direction="column" align="center" justify="center" className="mb-4">
                    <Box className={`size-16 rounded-full ${isActive ? activeColor : `${iconColor}-100 dark:${iconColor}-800`} flex items-center justify-center shadow-md`}>
                        {icon}
                    </Box>
                    <Text size="5" weight="bold" className="mt-2">{name}</Text>
                    <Text size="2" color="gray" align="center" className="mt-1">
                        {description}
                    </Text>
                    {isActive && (
                        <Flex align="center" gap="1" className="mt-2">
                            <Box className={`size-2 rounded-full ${activeColor}`}></Box>
                            <Text size="1" color={radixColor} weight="bold">
                                Active
                            </Text>
                        </Flex>
                    )}
                </Flex>

                {/* Toggle switch */}
                <Flex justify="center" className="mt-2">
                    <Controller
                        name={formPath}
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <Switch
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    onToggle(checked);
                                }}
                                size="3"
                            />
                        )}
                    />
                </Flex>
            </Box>

            {/* Action buttons when module is active */}
            {isActive && (
                <Box className="p-3 px-5 border-t border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-850">
                    <Flex justify="center" gap="3">
                        {fields.length > 0 && (
                            <Button
                                type="button"
                                variant={showConfig ? "solid" : "outline"}
                                color={radixColor}
                                onClick={() => {
                                    setShowConfig(!showConfig);
                                    if (!showConfig) setShowAccess(false);
                                }}
                                className="flex items-center gap-1"
                            >
                                <Settings size={14} />
                                Configure
                                {showConfig ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </Button>
                        )}

                        {hasLink && agentId && (
                            <Button
                                type="button"
                                variant={showAccess ? "solid" : "outline"}
                                color={radixColor}
                                onClick={() => {
                                    setShowAccess(!showAccess);
                                    if (!showAccess) setShowConfig(false);
                                }}
                                className="flex items-center gap-1"
                            >
                                <ExternalLink size={14} />
                                Access
                                {showAccess ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </Button>
                        )}
                    </Flex>
                </Box>
            )}

            {/* Expandable configuration when module is active and showConfig is true */}
            {isActive && showConfig && fields.length > 0 && (
                <Box className="p-5 pt-4 border-b border-neutral-200 dark:border-neutral-700">
                    <Flex direction="column" gap="4">
                        <Text size="2" weight="medium" className="mb-1">{name} Configuration</Text>
                        {/* Render các trường cài đặt */}
                        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            {fields.map((field, index) => (
                                <Box key={index} className="bg-neutral-50 dark:bg-neutral-850 p-4 rounded-lg">
                                    {renderField(field)}
                                </Box>
                            ))}
                        </Box>
                    </Flex>
                </Box>
            )}

            {/* Access module section when module is active and showAccess is true */}
            {isActive && showAccess && hasLink && agentId && (
                <Box className="p-5 pt-4 border-b border-neutral-200 dark:border-neutral-700">
                    <Flex direction="column" gap="4">
                        <Text size="2" weight="medium" className="mb-1">Access Module</Text>
                        <Box className="bg-neutral-50 dark:bg-neutral-850 p-4 rounded-lg">
                            <Flex direction="column" gap="3">
                                <Box>
                                    <Text size="1" as="label" className="mb-1 block">Public URL</Text>
                                    <Flex gap="2" className="mt-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${agentId}${linkPath}`}
                                            className="flex-1 px-3 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm font-mono"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={handleCopyLink}
                                            className="flex items-center gap-1 whitespace-nowrap"
                                            type="button"
                                        >
                                            <Copy size={14} />
                                            {copied ? "Copied!" : "Copy Link"}
                                        </Button>
                                    </Flex>
                                    <Text size="1" color="gray" className="mt-1">Share this URL to allow others to access this module.</Text>
                                </Box>

                                <Link
                                    href={`/${agentId}${linkPath}`}
                                    target="_blank"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <Button
                                        variant="soft"
                                        color={radixColor}
                                        className="flex items-center gap-1 w-full justify-center mt-2"
                                        type="button"
                                    >
                                        Open {name} <ExternalLink size={14} />
                                    </Button>
                                </Link>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>
            )}
        </Box>
    );
};

export default ModuleComponent; 