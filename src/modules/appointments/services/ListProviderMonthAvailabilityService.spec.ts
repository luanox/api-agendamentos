import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository'
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository : FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository
        );
    })

    it('should be able to list the month availability from provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 3, 20, 8, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 20, 8, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 20, 12, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2020, 4, 21, 8, 0, 0),
        });

        const availability = await listProviderMonthAvailabilityService.execute({
            provider_id: 'user',
            year: 2020,
            month: 5
        })

        expect(availability).toEqual(expect.arrayContaining([
            {day: 19, available: true},
            {day: 20, available: false},
            {day: 21, available: false},
            {day: 22, available: true},
        ]))
    })
})