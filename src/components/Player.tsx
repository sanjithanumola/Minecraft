import { useFrame, useThree } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { useKeyboard } from '../hooks/useKeyboard';

const JUMP_FORCE = 4;
const SPEED = 4;
const SPRINT_MULTIPLIER = 1.5;

export const Player = () => {
  const { moveBackward, moveForward, moveLeft, moveRight, jump, sprint } = useKeyboard();
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 25, 0],
  }));

  const velocity = useRef([0, 0, 0]);
  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
  }, [api.velocity]);

  const pos = useRef([0, 0, 0]);
  useEffect(() => {
    api.position.subscribe((p) => (pos.current = p));
  }, [api.position]);

  useFrame(() => {
    camera.position.copy(new Vector3(pos.current[0], pos.current[1] + 0.75, pos.current[2]));

    const direction = new Vector3();
    const frontVector = new Vector3(
      0,
      0,
      Number(moveBackward) - Number(moveForward)
    );
    const sideVector = new Vector3(
      Number(moveLeft) - Number(moveRight),
      0,
      0
    );

    const currentSpeed = sprint ? SPEED * SPRINT_MULTIPLIER : SPEED;

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(currentSpeed)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
    }

    // Respawn if fell off
    if (pos.current[1] < -20) {
      api.position.set(0, 25, 0);
      api.velocity.set(0, 0, 0);
    }
  });

  return <mesh ref={ref as any} />;
};
