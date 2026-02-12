import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('BUG-2: app/page.tsx does not pass onClick from a server component to <main>', () => {
    const pageSource = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');

    assert.equal(
        /<main[^>]*\sonClick\s*=/.test(pageSource),
        false,
        'app/page.tsx must not pass an onClick handler to <main> in a server component',
    );
});
