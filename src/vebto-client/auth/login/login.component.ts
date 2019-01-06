import {Component, ViewEncapsulation} from "@angular/core";
import {SocialAuthService} from "../social-auth.service";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {CurrentUser} from "../current-user";
import {Bootstrapper} from "../../core/bootstrapper.service";
import {Settings} from "../../core/config/settings.service";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {

    /**
     * Login credentials model.
     */
    public model: {email?: string, password?: string, remember?: boolean} = {remember: true};

    /**
     * Errors returned from backend.
     */
    public errors: {email?: string, password?: string, general?: string} = {};

    /**
     * Whether backend request is in progress currently.
     */
    public isLoading = false;

    /**
     * LoginComponent Constructor.
     */
    constructor(
        public auth: AuthService,
        public socialAuth: SocialAuthService,
        public settings: Settings,
        private router: Router,
        private user: CurrentUser,
        private bootstrapper: Bootstrapper
    ) {
        this.hydrateModel();
    }

    /**
     * Log user in and redirect to default auth user page.
     */
    public login() {
        this.isLoading = true;

        this.auth.login(this.model).subscribe(response => {
            this.bootstrapper.bootstrap(response.data);

            //TODO: Move this into auth service, so other components can re-use
            this.router.navigate([this.auth.getRedirectUri()]).then(navigated => {
                this.isLoading = false;

                if ( ! navigated) {
                    this.router.navigate([this.auth.getRedirectUri()]);
                }
            })
        }, response => {
            this.errors = response['messages'];
            this.isLoading = false;
        });
    }

    private hydrateModel() {
        if (this.settings.get('vebto.site.demo')) {
            this.model.email = 'admin@admin.com';
            this.model.password = 'admin';
        }
    }
}
