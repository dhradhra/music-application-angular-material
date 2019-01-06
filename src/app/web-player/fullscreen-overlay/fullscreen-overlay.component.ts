import {Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {PlayerQueue} from "../player/player-queue.service";
import {Track} from "../../models/Track";
import {FullscreenOverlay} from "./fullscreen-overlay.service";
import {Player} from "../player/player.service";
import {TrackContextMenuComponent} from "../tracks/track-context-menu/track-context-menu.component";
import {Subscription} from "rxjs";
import {WebPlayerState} from "../web-player-state.service";
import {BrowserEvents} from "vebto-client/core/services/browser-events.service";
import {WebPlayerImagesService} from "../web-player-images.service";
import {ContextMenu} from 'vebto-client/core/ui/context-menu/context-menu.service';

@Component({
    selector: 'fullscreen-overlay',
    templateUrl: './fullscreen-overlay.component.html',
    styleUrls: ['./fullscreen-overlay.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.maximized]': 'overlay.isMaximized()',
        'class': 'fullscreen-overlay',
    }
})
export class FullscreenOverlayComponent implements OnInit, OnDestroy {

    /**
     * Active component subscription.
     */
    public subscription: Subscription;

    /**
     * FullscreenOverlayComponent Constructor.
     */
    constructor(
        public player: Player,
        private el: ElementRef,
        public queue: PlayerQueue,
        private contextMenu: ContextMenu,
        public overlay: FullscreenOverlay,
        private browserEvents: BrowserEvents,
        public state: WebPlayerState,
        public wpImages: WebPlayerImagesService,
    ) {}

    ngOnInit () {
        this.subscription = this.browserEvents.globalKeyDown$.subscribe(e => {
            //minimize overlay on ESC key press.
            if (e.keyCode === this.browserEvents.keyCodes.escape) {
                this.overlay.minimize();
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription = null;
    }

    /**
     * Get current track in player queue.
     */
    public getCurrent() {
        return this.queue.getCurrent() || new Track();
    }

    /**
     * Get previous track in player queue.
     */
    public getPrevious() {
        return this.queue.getPrevious() || this.getCurrent();
    }

    /**
     * Get next track in player queue.
     */
    public getNext() {
        return this.queue.getNext() || this.getCurrent();
    }

    /**
     * Get image for specified track.
     */
    public getTrackImage(track: Track) {
        if ( ! track || ! track.album) return this.wpImages.getDefault('album');
        return track.album.image;
    }

    /**
     * Open track context menu.
     */
    public openTrackContextMenu(track: Track, e: MouseEvent) {
        e.stopPropagation();

        this.contextMenu.open(
            TrackContextMenuComponent,
            e.target,
            {data: {item: track, type: 'track'}}
        );
    }

    /**
     * Exit browser fullscreen mode or minimize the overlay.
     */
    public minimize() {
        if (this.isBrowserFullscreen()) {
            this.exitBrowserFullscreen();
        } else {
            this.overlay.minimize();
        }
    }

    /**
     * Toggle browser fullscreen mode.
     */
    public toggleBrowserFullscreen() {
        let el = this.el.nativeElement;

        if (this.isBrowserFullscreen()) {
            return this.exitBrowserFullscreen();
        }

        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullScreen) {
            el.webkitRequestFullScreen();
        }
    }

    /**
     * Exit browser fullscreen mode.
     */
    public exitBrowserFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document['mozCancelFullScreen']) {
            document['mozCancelFullScreen']();
        } else if (document['msExitFullscreen']) {
            document['msExitFullscreen']();
        }
    }

    /**
     * Check if browser fullscreen mode is active.
     */
    public isBrowserFullscreen() {
        return document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document['mozFullscreenElement'] ||
        document['msFullScreenElement'];
    }
}
