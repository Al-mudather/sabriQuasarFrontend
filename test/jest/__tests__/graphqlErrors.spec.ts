import { payloadErrorMessages, resultErrorMessages, matchesError } from 'src/utils/graphqlErrors'
test('bare message object', () => expect(payloadErrorMessages({ message: 'Order not found' })).toEqual(['Order not found']))
test('field map', () => expect(payloadErrorMessages({ amount: [{ message: 'too low' }] })).toEqual(['too low']))
test('stripe list of single-key objects', () => expect(payloadErrorMessages([{ stripe: 'Stripe payments are not available' }])).toEqual(['Stripe payments are not available']))
test('stripe order refusal', () => expect(payloadErrorMessages([{ order: 'Order not found' }])).toEqual(['Order not found']))
test('string and null', () => { expect(payloadErrorMessages('x')).toEqual(['x']); expect(payloadErrorMessages(null)).toEqual([]) })
test('top-level errors', () => expect(resultErrorMessages({ errors: [{ message: 'Order matching query does not exist.' }], data: { order: null } })).toEqual(['Order matching query does not exist.']))
test('matchesError', () => expect(matchesError({ errors: { message: 'Already exists' } }, /already exists/i)).toBe(true))
