import { Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from 'src/app/services/job.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { constants } from 'src/app/app.constants';
import { saveAs } from 'file-saver';
import { UtilService } from 'src/app/services/util.service';
import { EmitterService } from 'src/app/services/emitter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-past-jobs',
  templateUrl: './past-jobs.component.html',
  styleUrls: ['./past-jobs.component.scss']
})
export class PastJobsComponent implements OnInit {

  jobs;
  dataSource;
  constants = constants;
  displayedColumns: string[] = ['jobId', 'stats', 'guidance', 'status'];
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private jobService: JobService,
    private utilService: UtilService,
    private emitterService: EmitterService
  ) { }

  ngOnInit(): void {
    this.jobService.getAllJobs().subscribe(
      (res: any) => {
        if (res.success) {
          this.jobs = res.jobs;
          this.jobs.filter(
            job => job.status === constants.jobStatus.completed
          ).forEach(
            job => {
              if (this.functionInvocated(job, 'stats')) {
                job.stats = job.jobId + '-' + 'stats.csv';
              }
              if (this.functionInvocated(job, 'guidance')) {
                job.guidance = job.jobId + '-' + 'guidance.csv';
              }
            }
          )
          this.dataSource = new MatTableDataSource(this.jobs);
          this.dataSource.sort = this.sort;
        } else {
          this.utilService.openSnackBar('An error occurred while getting the past jobs.');
        }
      },
      err => {
        this.utilService.openSnackBar('An error occurred while getting the past jobs.');
      }
    );

    this.emitterService.emitter.pipe(takeUntil(this.destroy$)).subscribe((emitted) => {
      switch(emitted.event) {
        case constants.emitterKeys.jobStarted:
          return this.dataSource.data = [ ...this.dataSource.data, emitted.data ];
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  download(fileName) {
    this.jobService.download(
      fileName
    ).subscribe(
      (data: any) => {
        saveAs(data, fileName);
      }, err => {
        this.utilService.openSnackBar('An error occurred while getting the file.');
      }
    );
  }

  // check if certain function was invocated for a job
  functionInvocated(job, functionName) {
    switch(functionName) {
      case constants.jobFunctions.guidance:
        return [
          constants.jobFunctionCodes.guidance,
          constants.jobFunctionCodes.both
        ].includes(job.toInvoke);

      case constants.jobFunctions.stats:
        return [
          constants.jobFunctionCodes.stats,
          constants.jobFunctionCodes.both
        ].includes(job.toInvoke);
    }
  }

  getBadgeStyle(job) {
    switch (job.status) {
      case constants.jobStatus.completed:
        return 'badge-success';
      case constants.jobStatus.failed:
          return 'badge-danger';
      case constants.jobStatus.running:
        return 'badge-primary';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
