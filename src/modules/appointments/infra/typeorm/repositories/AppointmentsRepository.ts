import { getRepository, Repository, Raw } from 'typeorm'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';

class AppointmentsRepository implements IAppointmentsRepository{
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date): Promise<Appointment | undefined >{
        const findAppointment = await this.ormRepository.findOne({
            where: {date: date},
        })

        return findAppointment || undefined
    }

    public async findAllInMonthFromProvider({provider_id, month, year}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]>{
        const parseMonth = String(month).padStart(2, '0');

        const appointments = this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName => `to_char(${dateFieldName}, 'MM-YYYY') = '${parseMonth}-${year}'`
                )
            }
        });

        return appointments;
    }

    public async create({provider_id, date}: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({provider_id, date});

        await this.ormRepository.save(appointment);

        return appointment;
    }


}

export default AppointmentsRepository