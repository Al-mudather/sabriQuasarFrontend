import { stripeKeyFromPayload } from 'src/utils/stripe'
test('null key hides stripe', () => expect(stripeKeyFromPayload(null)).toBeNull())
test('reads backend spelling', () => expect(stripeKeyFromPayload({ publisableKey: 'pk_test_1' })).toBe('pk_test_1'))
test('empty string is null', () => expect(stripeKeyFromPayload({ publisableKey: '' })).toBeNull())
test('accepts JSON-encoded string', () => expect(stripeKeyFromPayload('{"publisableKey": "pk_test_1"}')).toBe('pk_test_1'))
test('invalid JSON is null', () => expect(stripeKeyFromPayload('not json')).toBeNull())
test('JSON null is null', () => expect(stripeKeyFromPayload('null')).toBeNull())
