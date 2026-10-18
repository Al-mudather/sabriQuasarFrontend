import { joinPlatformOutcome } from 'src/utils/joinPlatform'

test('success', () => expect(joinPlatformOutcome({ data: { joinPlatform: { success: true, errors: null } } })).toBe('joined'))
test('already exists is treated as joined', () => expect(joinPlatformOutcome({ data: { joinPlatform: { success: false, errors: { message: 'Already exists' }, instance: null } } })).toBe('already'))
test('bad code', () => expect(joinPlatformOutcome({ data: { joinPlatform: null }, errors: [{ message: 'Pyramid matching query does not exist.' }] })).toBe('invalid'))
test('permission', () => expect(joinPlatformOutcome({ data: { joinPlatform: null }, errors: [{ message: 'You do not have permission to perform this action' }] })).toBe('error'))
