import * as moment from "moment";
import { UtilHelper } from "src/app/_helpers";
import { AnalysisTaskStatus } from "src/app/_helpers/enums/analysis-task-status";
import { Deserializable } from "../deserializable.model";
import { AnalysisTaskException } from "../analysis-task-exception/analysis-task-exception.model";

const analysisTaskStatusMessage: any = {
  'PENDING': 'Uploading your data...',
  'RECEIVED': 'Your data has been received and placed in a queue to be processed.',
  'SCHEMA_ERROR': 'Inconsistencies have been detected in the input files. Please click on "Show validation results" for more details.',
  'STARTED': 'Please wait. Your data is being analyzed. This process may take a few minutes, so feel free to grab a coffee. On average, files with 25,000 schools take around 15 to 20 minutes to execute.',
  'SUCCESS': 'Analysis completed! Please click on "Show Results" for more details',
  'FAILURE': 'Analysis failed! Please click on "Contact Us" to send us a message with detailed information about the error.',
}

export class AnalysisTask implements Deserializable {
  id: String;
  status: AnalysisTaskStatus;
  receivedAt: any;
  startedAt: any;
  failureAt: any;
  successAt: any;
  statusCheckedAt: any;
  statusCheckCode: number;
  statusCheckMessage: string;
  exception: AnalysisTaskException | null;

  constructor() {
    this.id = '';
    this.status = AnalysisTaskStatus.Pending;
    this.statusCheckCode = 0;
    this.statusCheckMessage = '';
    this.exception = null;

    this.statusCheckedAt = moment();
  }

  deserialize(input: any): this {
    this.id = input.taskID;
    this.status = input.taskState;

    if (input.taskException) {
      this.exception = new AnalysisTaskException().deserialize(input.taskException);

      if (this.exception && this.exception.exceptionType === 'TableSchemaError') {
        this.status = AnalysisTaskStatus.SchemaError;
      }
    }

    this.statusCheckedAt = moment();

    const inputDateFielsMap = {
      failureAt: 'taskFailedDate',
      receivedAt: 'taskReceivedDate',
      startedAt: 'taskStartedDate',
      successAt: 'taskSucceededDate'
    } as any;

    // SET DATE FIEDS VALUES
    Object.keys(inputDateFielsMap).forEach((key) => {
      const inputDateField = input[inputDateFielsMap[key]];
      if (inputDateField) {
        (this as any)[key] = moment(moment.utc(inputDateField));
      }
    });

    return this;
  }

  fromLocalStorage(input: any): this {
    this.id = input.id;
    this.status = input.status;
    this.statusCheckCode = input.statusCheckCode;
    this.statusCheckMessage = input.statusCheckMessage;
    this.exception = input.exception;

    const inputDateFielsMap = [
      'failureAt',
      'receivedAt',
      'startedAt',
      'statusCheckedAt',
      'successAt',
    ];

    inputDateFielsMap.forEach((dateField) => {
      const dateValue = input[dateField];
      if (dateValue) {
        const momentDate = moment(dateValue);
        if (momentDate.isValid()) {
          (this as any)[dateField] = momentDate;
        }
      }
    });

    return this;
  }

  toLocalStorageString() {
    let obj = Object.assign({}, this);

    return JSON.stringify(obj);
  }

  get failureAtString() {
    return this.failureAt ? this.failureAt.format('L LTS') : '';
  }

  get receivedAtString() {
    return this.receivedAt ? this.receivedAt.format('L LTS') : '';
  }

  get startedAtString() {
    return this.startedAt ? this.startedAt.format('L LTS') : '';
  }

  get statusCheckedAtString() {
    return this.statusCheckedAt ? this.statusCheckedAt.format('L LTS') : '';
  }

  get successAtString() {
    return this.successAt ? this.successAt.format('L LTS') : '';
  }

  get successDurationString() {
    if (!this.startedAt || !this.successAt) {
      return "";
    }

    const durationMs = this.startedAt.diff(this.successAt, 'milliseconds');

    return UtilHelper.formatDuration(durationMs);
  }

  get statusMessage() {
    return analysisTaskStatusMessage[this.status];
  }
}