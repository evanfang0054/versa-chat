import * as React from 'react';
import { ProgressIndicator } from '@versa-chat/ui';
import { Button, Space } from 'antd-mobile';
import { AddCircleOutline, MinusCircleOutline } from 'antd-mobile-icons';
import { launchCustom } from '@/utils/confetti';

const Demo: React.FC = () => {
  const [percent, setPercent] = React.useState(0);

  const handleConfettiLaunch = async () => {
    await launchCustom(
      {
        type: 'solid',
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
      },
      undefined,
      {
        particleCount: 100,
        spread: 90,
        startVelocity: 50,
      }
    );
  };

  return (
    <>
      <Button color="primary" className="m-2" onClick={handleConfettiLaunch}>
        🎉 点击我发射纸屑！
      </Button>

      <Space>
        <Button
          color="primary"
          className="m-2"
          onClick={() => {
            if (percent < 100) {
              setPercent(percent + 10);
            }
          }}
        >
          <AddCircleOutline />
        </Button>

        <Button
          color="primary"
          className="m-2"
          onClick={() => {
            if (percent > 0) {
              setPercent(percent - 10);
            }
          }}
        >
          <MinusCircleOutline />
        </Button>
      </Space>

      <Space direction="vertical" block className="gap-2">
        <ProgressIndicator
          percent={percent}
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
            direction: '45deg',
          }}
          strokeWidth={6}
          trailColor="#555"
        />

        <ProgressIndicator
          percent={percent}
          trailColor="#555"
          shape="semi-circle"
          strokeColor="red"
          size={100}
          strokeWidth={6}
        />

        <ProgressIndicator
          percent={percent}
          trailColor="#555"
          shape="semi-circle"
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
            direction: '45deg',
          }}
          size={100}
          strokeWidth={6}
        />

        <ProgressIndicator
          percent={percent}
          trailColor="#555"
          shape="circle"
          strokeColor="red"
          size={100}
          strokeWidth={6}
        />

        <ProgressIndicator
          percent={percent}
          trailColor="#555"
          strokeWidth={6}
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
            direction: '45deg',
          }}
        />

        <ProgressIndicator
          percent={percent}
          strokeWidth={6}
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
            direction: '45deg',
          }}
          trailColor="#555"
          format={(percent) => `完成率: ${percent}%`}
        />
      </Space>
    </>
  );
};

export default Demo;
