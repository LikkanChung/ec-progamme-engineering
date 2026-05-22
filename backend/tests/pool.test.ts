describe('db/pool', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  afterEach(() => {
    process.env.DATABASE_URL = originalDatabaseUrl;
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('uses DATABASE_URL from environment when provided', () => {
    process.env.DATABASE_URL = 'postgresql://example-from-env';

    const mockOn = jest.fn();
    const mockPoolInstance = { on: mockOn };
    const PoolMock = jest.fn(() => mockPoolInstance);

    jest.isolateModules(() => {
      jest.doMock('pg', () => ({ Pool: PoolMock }));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../src/db/pool');
    });

    expect(PoolMock).toHaveBeenCalledWith({
      connectionString: 'postgresql://example-from-env',
    });
    expect(mockOn).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('falls back to default connection string and handles pool errors', () => {
    delete process.env.DATABASE_URL;

    const mockOn = jest.fn();
    const mockPoolInstance = { on: mockOn };
    const PoolMock = jest.fn(() => mockPoolInstance);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never);

    jest.isolateModules(() => {
      jest.doMock('pg', () => ({ Pool: PoolMock }));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../src/db/pool');
    });

    expect(PoolMock).toHaveBeenCalledWith({
      connectionString: 'postgresql://postgres:postgres@localhost:5432/urlshortener',
    });

    const handler = mockOn.mock.calls.find(([event]) => event === 'error')?.[1] as
      | ((err: Error) => void)
      | undefined;

    expect(handler).toBeDefined();

    const boom = new Error('pool exploded');
    handler?.(boom);

    expect(errorSpy).toHaveBeenCalledWith('Unexpected error on idle client', boom);
    expect(exitSpy).toHaveBeenCalledWith(-1);
  });
});
