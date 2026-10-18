import { stripeKeyFromPayload } from 'src/utils/stripe'
test('null key hides stripe', () => expect(stripeKeyFromPayload(null)).toBeNull())
test('reads backend spelling', () => expect(stripeKeyFromPayload({ publisableKey: 'pk_test_1' })).toBe('pk_test_1'))
test('empty string is null', () => expect(stripeKeyFromPayload({ publisableKey: '' })).toBeNull())
