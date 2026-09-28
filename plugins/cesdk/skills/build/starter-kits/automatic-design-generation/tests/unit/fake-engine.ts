import type { CreativeEngine } from '@cesdk/cesdk-js';

export interface FakeEngineCall {
  method: string;
  args: unknown[];
}

export interface FakeEngine {
  /** Pass this where the fill callback expects a `CreativeEngine`. */
  engine: CreativeEngine;
  calls: FakeEngineCall[];
  callsTo(method: string): FakeEngineCall[];
  /** Arguments of the last call to `method`, or `undefined`. */
  lastArgsOf(method: string): unknown[] | undefined;
}

/** Block ids the fake resolves `findByName` to, so a test can assert per block. */
export const FAKE_BLOCKS: Record<string, number[]> = {
  PodcastCover: [10, 11],
  PodcastBadge: [20],
  'Message & Name': [30]
};

/** The fill of block `id`, as the fake reports it from `getFill`. */
export function fakeFillOf(block: number): number {
  return block + 1000;
}

/**
 * A hand-written engine double. The generic API spy returns proxies, which the
 * fill callback iterates over, so this records the few calls the fill makes.
 */
export function createFakeEngine(): FakeEngine {
  const calls: FakeEngineCall[] = [];
  const record =
    (method: string) =>
    (...args: unknown[]) => {
      calls.push({ method, args });
    };

  const engine = {
    block: {
      setColor: record('block.setColor'),
      findByName: (name: string) => FAKE_BLOCKS[name] ?? [],
      getFill: fakeFillOf,
      setString: record('block.setString'),
      setTextColor: record('block.setTextColor')
    },
    variable: {
      setString: record('variable.setString')
    }
  };

  return {
    engine: engine as unknown as CreativeEngine,
    calls,
    callsTo: (method) => calls.filter((call) => call.method === method),
    lastArgsOf(method) {
      return calls.filter((call) => call.method === method).at(-1)?.args;
    }
  };
}
