import {Component, ViewEncapsulation} from '@angular/core';
import {Settings} from "vebto-client/core/config/settings.service";
import {SearchSlideoutPanel} from "../search/search-slideout-panel/search-slideout-panel.service";
import {CurrentUser} from "vebto-client/auth/current-user";
import {Player} from "../player/player.service";
import {WebPlayerUrls} from "../web-player-urls.service";
import {UserPlaylists} from "../playlists/user-playlists.service";
import {Modal} from "vebto-client/core/ui/modal.service";
import {CrupdatePlaylistModalComponent} from "../playlists/crupdate-playlist-modal/crupdate-playlist-modal.component";
import {Router} from "@angular/router";
import {Track} from "../../models/Track";
import {AuthService} from "vebto-client/auth/auth.service";
import {WebPlayerImagesService} from "../web-player-images.service";

@Component({
    selector: 'nav-sidebar',
    templateUrl: './nav-sidebar.component.html',
    styleUrls: ['./nav-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NavSidebarComponent {

    /**
     * NavSidebarComponent Constructor.
     */
    constructor(
        public settings: Settings,
        public searchPanel: SearchSlideoutPanel,
        public currentUser: CurrentUser,
        public player: Player,
        public urls: WebPlayerUrls,
        public auth: AuthService,
        public playlists: UserPlaylists,
        private modal: Modal,
        private router: Router,
        public wpImages: WebPlayerImagesService,
    ) {}

    public openNewPlaylistModal() {
        if ( ! this.currentUser.isLoggedIn()) {
            this.router.navigate(['/login']);
        }

        this.modal.open(CrupdatePlaylistModalComponent, null, 'crupdate-playlist-modal-container')
            .afterClosed()
            .subscribe(playlist => {
            if ( ! playlist) return;
            this.playlists.add(playlist);
            this.router.navigate(this.urls.playlist(playlist));
        });
    }

    /**
     * Get image for specified track.
     */
    public getTrackImage(track: Track) {
        if ( ! track || ! track.album) return this.wpImages.getDefault('album');
        return track.album.image;
    }
}
