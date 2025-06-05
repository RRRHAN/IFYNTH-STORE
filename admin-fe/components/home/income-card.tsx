// components/income-card.tsx
import React from 'react';
import { Dimensions } from 'react-native';
import { Box } from '../ui/box';
import { Heading } from '../ui/heading';
import { Text } from '../ui/text';

const { width } = Dimensions.get('window');

interface MyRevenueCardProps {
  incomeAmount?: number | null;
  percentageChange?: number | null;
  cardTitle?: string;
  variant?: 'dark' | 'light' | 'primary' | 'secondary' | 'accent';
}

const MyRevenueCard: React.FC<MyRevenueCardProps> = ({
  incomeAmount,
  percentageChange,
  cardTitle = "Total Revenue",
  variant = 'dark' // Set nilai default 'dark'
}) => {
  const formattedAmount = incomeAmount != null
    ? `Rp. ${Math.floor(incomeAmount).toLocaleString('id-ID')}`
    : 'Rp.0';

  const formattedPercentage = percentageChange != null
    ? `${percentageChange.toFixed(1)}% from last month`
    : 'N/A from last month';
  const percentageTextColorClass = percentageChange && percentageChange >= 0 ? 'text-green-500' : 'text-red-500';

  // Logika untuk menentukan kelas background berdasarkan variant
  let backgroundColorClass = '';
  let textColorClass = ''; // Untuk teks utama dan heading
  let subtitleColorClass = '';
  let borderColorClass = '';

  switch (variant) {
    case 'light':
      backgroundColorClass = 'bg-white';
      textColorClass = 'text-neutral-900';
      subtitleColorClass = 'text-neutral-500';
      borderColorClass = 'border-neutral-200'; // Contoh
      break;
    case 'primary':
      backgroundColorClass = 'bg-blue-600'; // Contoh warna biru
      textColorClass = 'text-white';
      subtitleColorClass = 'text-blue-200';
      borderColorClass = 'border-blue-400';
      break;
    case 'secondary':
        backgroundColorClass = 'bg-gray-700'; // Contoh warna abu-abu gelap
        textColorClass = 'text-white';
        subtitleColorClass = 'text-gray-300';
        borderColorClass = 'border-gray-500';
        break;
    case 'accent':
        backgroundColorClass = 'bg-purple-600'; // Contoh warna ungu
        textColorClass = 'text-white';
        subtitleColorClass = 'text-purple-200';
        borderColorClass = 'border-purple-400';
        break;
    case 'dark': // Default
    default:
      backgroundColorClass = 'bg-neutral-900'; // Warna gelap asli
      textColorClass = 'text-neutral-50';
      subtitleColorClass = 'text-neutral-300';
      borderColorClass = 'border-neutral-700';
      break;
  }

  return (
    <Box
      className={`
        ${backgroundColorClass}
        rounded-lg p-5 m-4
        shadow-black shadow-sm        
        self-center
        ${borderColorClass} border
      `}
      style={{ width: width < 768 ? width * 0.88 : width * 0.4 }}
    >
      {/* Header Card */}
      <Text
        className={`
          ${subtitleColorClass} text-sm mb-2
        `}
      >
        {cardTitle}
      </Text>
      <Heading
        className={`
          ${textColorClass} text-2xl mb-3
        `}
      >
        {formattedAmount}
      </Heading>
      <Text
        className={`
          ${percentageTextColorClass}   text-sm font-bold mb-5
        `}
      >
        {formattedPercentage}
      </Text>
    </Box>
  );
};

export default MyRevenueCard;