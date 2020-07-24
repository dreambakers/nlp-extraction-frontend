import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { JobService } from 'src/app/services/job.service';
import { UtilService } from 'src/app/services/util.service';
import { constants } from 'src/app/app.constants';
import { EmitterService } from 'src/app/services/emitter.service';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.scss']
})
export class NewJobComponent implements OnInit {

  constants = constants;
  newJobForm: FormGroup;
  loading = false;
  toInvoke = constants.jobFunctionCodes.both;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private utilService: UtilService,
    private emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.newJobForm = this.fb.group({
      toInvoke: constants.jobFunctionCodes.both,
      handles: this.fb.array([
        this.fb.group({
          handle: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]{1,15}$')]]
        })
      ])
    });
  }

  onAddHandleClick() {
    this.handles.push(this.fb.group({handle: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]{1,15}$')]] }));
  }

  onDeleteHandleClick(index) {
    this.handles.removeAt(index);
  }

  onStartJobClick() {
    console.log(this.newJobForm.value)
    this.jobService.invokeJob(this.newJobForm.value).subscribe(
      (res: any) => {
        if (res.success) {
          this.utilService.openSnackBar('Job started successfully.');
          this.emitterService.emit(this.constants.emitterKeys.jobStarted, res.job);
        } else {
          this.utilService.openSnackBar('An error occurred starting the job. Please check the logs for more details.');
        }
      },
      err => {
        this.utilService.openSnackBar('An error occurred starting the job. Please check the logs for more details.');
      }
    )
  }

  get handles() {
    return this.newJobForm.get('handles') as FormArray;
  }

}
