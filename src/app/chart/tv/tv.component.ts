import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MockService} from '../providers/mock.service';
import {timer} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-tv',
  templateUrl: './tv.component.html',
  styleUrls: ['./tv.component.scss']
})
export class TvComponent implements OnInit, OnDestroy {
  @Input()
  symbol: any;

  tradingview: any;

  ws: { onopen: () => void; close: () => void; onmessage: (e: any) => void; send: { (arg0: string): void; (arg0: string): void; }; };
  wsMessage = 'you may need to send specific message to subscribe data, eg: BTC';

  granularityMap = {

    '5': 300,
    '30': 30 * 60,
    '60': 60 * 60,
    '120': 60 * 60 * 2,
    '240': 60 * 60 * 4,
    '360': 60 * 60 * 6,
    'D': 86400
  };

  constructor(private mockService: MockService) {
  }

  ngOnInit() {
    this.ws = this.mockService.fakeWebSocket();

    this.ws.onopen = () => {
      this.drawTv();
    };
  }

  ngOnDestroy() {
    this.ws.close();
  }

  drawTv() {
    const that = this;

    this.tradingview = new (window as any).TradingView.widget({
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      fullscreen: true,
      symbol: that.symbol,
      interval: '5',
      container_id: 'tradingview',
      library_path: 'assets/vendors/charting_library/',
      locale: 'en',
      theme: 'dark',
      disabled_features: [
        // 'timeframes_toolbar',
        // 'go_to_date',
        // 'use_localstorage_for_settings',
        // 'volume_force_overlay',
        // 'show_interval_dialog_on_key_press',
        // 'symbol_search_hot_key',
        'study_dialog_search_control',
        // 'display_market_status',
        'header_compare',
        'header_symbol_search',
        // 'header_fullscreen_button',
        // 'header_settings',
        // 'header_chart_type',
        // 'header_resolutions',
        'control_bar',
        'edit_buttons_in_legend',
        'border_around_the_chart',
        'main_series_scale_menu',
        'star_some_intervals_by_default',
        'datasource_copypaste',
        'header_indicators',
        // 'context_menus',
        'compare_symbol',
        'header_undo_redo',
        'border_around_the_chart',
        'timezone_menu',
        'remove_library_container_border',
      ],
      allow_symbol_change: true,
      // enabled_features: ['study_templates'],
      // charts_storage_url: 'http://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      timezone: 'America/New_York',
      volumePaneSize: 'tiny',
      datafeed: {
        onReady(x: (arg0: { supported_resolutions: string[]; }) => void) {
          timer(0)
            .pipe(
              tap(() => {
                x({
                  supported_resolutions: ['5', '30', '60', '120', '240', '360', 'D']
                });
              })
            ).subscribe();
        },

        getBars(symbol: any, granularity: string | number, startTime: any, endTime: any,
                onResult: (arg0: any) => void, onError: any, isFirst: any) {
          that.mockService.getHistoryList({
            // @ts-ignore
            granularity: that.granularityMap[granularity],
            startTime,
            endTime
          }).subscribe((data: any) => {
            // push the history data to callback
            onResult(data);
          });
        },
        resolveSymbol(symbol: any, onResolve: (arg0: {
          name: string; full_name: string; // display on the chart
          base_name: string; has_intraday: boolean;
        }) => void) {
          timer(1e3)
            .pipe(
              tap(() => {
                onResolve({
                  name: that.symbol,
                  full_name: that.symbol, // display on the chart
                  base_name: that.symbol,
                  has_intraday: true, // enable minute and others
                });
              })
            ).subscribe();
        },
        getServerTime() {
        },
        subscribeBars(symbol: any, granularity: string | number, onTick: (arg0: any) => void) {
          that.ws.onmessage = (e) => {
            try {
              const data = e;
              if (data) {
                // realtime data
                // data's timestamp === recent one ? Update the recent one : A new timestamp data
                onTick(data);
              }
            } catch (e) {
            }
          };

          // subscribe the realtime data
          // @ts-ignore
          that.ws.send(`${that.wsMessage}_kline_${that.granularityMap[granularity]}`);
        },
        unsubscribeBars() {
          that.ws.send('stop receiving data or just close websocket');
        },
      },
    });
  }
}
