import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CaregiverService } from 'src/app/shared/services/caregiver.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ConstantService } from 'src/app/shared/services/constant.service';

interface ApiResponse {
    message: string;
    status: number;
    success: boolean;
    data: any;
}
@Injectable()
export class ProfileViewResolver implements Resolve<any> {
    registrationNo = 0;
    constructor(
        private caregiverService: CaregiverService,
        private toastr: ToastrService,
        private navigationService: NavigationService,
        private constant: ConstantService) { }

    resolve(route: ActivatedRouteSnapshot) {
        this.registrationNo = Number(route.params.id);
        if (this.registrationNo && this.registrationNo > 0) {
            this.caregiverService.getProfileOverviewDetails(this.registrationNo).subscribe((returnData: ApiResponse) => {
                const { success, data } = returnData;
                if (success) {
                    if (data.user) {
                        if (data.user.is_deleted === 1) {
                            this.toastr.error(this.constant.DELETED_CAREGIVER);
                            this.navigationService.navigateToHome();
                        }
                    }
                }
            })
        }
    }
}
