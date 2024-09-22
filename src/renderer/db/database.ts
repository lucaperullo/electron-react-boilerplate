import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import path from 'path';
import { app } from 'electron';
import { User as UserType, Appointment as AppointmentType, Availability as AvailabilityType } from './types'; // Ensure this path is correct

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(app.getPath('userData'), 'database.sqlite'),
});

interface UserCreationAttributes extends Optional<UserType, 'id'> {}
interface AppointmentCreationAttributes extends Optional<AppointmentType, 'id'> {}
interface AvailabilityCreationAttributes extends Optional<AvailabilityType, 'id'> {}

class User extends Model<UserType, UserCreationAttributes> implements UserType {
  public id!: number;
  public name!: string;
  public surname!: string;
  public role!: 'doctor' | 'patient';
  public specialty?: string;
  public phone_number!: string;
  public email?: string;
  public readonly appointments?: Appointment[];
}

class Appointment extends Model<AppointmentType, AppointmentCreationAttributes> implements AppointmentType {
  public id!: number;
  public time!: string;
  public doctorID!: number;
  public patientID!: number;
}

class Availability extends Model<AvailabilityType, AvailabilityCreationAttributes> implements AvailabilityType {
  public id!: number;
  public doctorID!: number;
  public date!: string;
  public startTime!: string;
  public endTime!: string;
  public duration!: number;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialty: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    doctorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    patientID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Appointment',
  }
);

Availability.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    doctorID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Availability',
  }
);

User.hasMany(Appointment, { foreignKey: 'doctorID' });
User.hasMany(Appointment, { foreignKey: 'patientID' });
Appointment.belongsTo(User, { as: 'Doctor', foreignKey: 'doctorID' });
Appointment.belongsTo(User, { as: 'Patient', foreignKey: 'patientID' });

User.hasMany(Availability, { foreignKey: 'doctorID' });
Availability.belongsTo(User, { as: 'Doctor', foreignKey: 'doctorID' });

sequelize.sync();

export { sequelize, User, Appointment, Availability };