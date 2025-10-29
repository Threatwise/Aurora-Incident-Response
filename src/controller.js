/**
 * Controller for GUI event handling with modern JavaScript features
 */

// Test electronAPI availability on load
console.log('[Controller] Starting, electronAPI available:', !!globalThis.electronAPI);
if (globalThis.electronAPI) {
    console.log('[Controller] electronAPI.getAppPath:', globalThis.electronAPI.getAppPath());
} else {
    console.error('[Controller] electronAPI NOT AVAILABLE - file operations will fail!');
}

/**
 * Controller for GUI event handling with modern JavaScript features
 */

// All events for gui components ("clicks, etc") will be hooked up here
function registerComponents() {
  let currentgrid;
  try {
    logger.info("Registering GUI components");

    //////////////////
    // Main Toolbar //
    //////////////////

    w2ui.toolbar.onClick = (event) => {
      try {
        logger.debug("Toolbar click event", { target: event.target });

        switch (event.target) {
          case "file:new_sod":
            newSOD();
            break;
          case "file:open_sod":
            openSOD();
            break;
          case "file:save_sod":
            saveSOD();
            break;
          case "file:release_lock":
            releaseLock();
            break;
          case "file:request_lock":
            requestLock();
            break;
          case "file:force_unlock":
            forceUnLock();
            break;
          case "file:open_webdav":
            test_webdav();
            break;
          case "case_details":
            openCasePopup();
            break;
          case "help:about":
            openAboutPopup();
            break;
          case "help:online_help":
            browser_open("https://cyberfox.blog/aurora");
            break;
          default:
            logger.warn("Unknown toolbar event target", {
              target: event.target,
            });
        }
      } catch (error) {
        logger.error("Error handling toolbar click", {
          target: event.target,
          error: error.message,
        });
      }
    };

    logger.info("GUI components registered successfully");
  } catch (error) {
    logger.error("Failed to register GUI components", {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }

  /////////////
  // Sidebar //
  /////////////

  //that needs some more work to offload functionality where it needs to be
  w2ui.sidebar.onClick = (event) => {
    try {
      logger.debug("Sidebar click event", { target: event.target });

      // Refactored sidebar event handling using a mapping object for maintainability
      const sidebarHandlers = {
        killchain_view: () => showKillChainView(),
        pyramid_view: () => showPyramidView(),
        mitre_heatmap: () => showMitreHeatmap(),
        killchain_builder: () => showKillChainBuilder(),
        diamond_model: () => showDiamondModel(),
        cti_mode: () => showCTIMode(),
        timeline: () => {
          syncAllChanges();
          if (lockedByMe) {
            w2ui.grd_timeline.getColumn("owner").editable.items =
              case_data.investigators;
            w2ui.grd_timeline.getColumn("event_host").editable.items =
              case_data.systems;
            w2ui.grd_timeline.getColumn("event_source_host").editable.items =
              case_data.systems;
            w2ui.grd_timeline.getColumn("direction").editable.items =
              case_data.direction;
            w2ui.grd_timeline.getColumn("killchain").editable.items =
              case_data.killchain;
            const pyramidOptions = case_data.pyramid_levels
              ? case_data.pyramid_levels.map((level) => level.text)
              : [];
            w2ui.grd_timeline.getColumn("pyramid_pain").editable.items =
              pyramidOptions;
          }
          w2ui.main_layout.content("main", w2ui.grd_timeline);
        },
        investigated_systems: () => {
          syncAllChanges();
          if (lockedByMe) {
            w2ui.grd_investigated_systems.getColumn("analyst").editable.items =
              case_data.investigators;
            w2ui.grd_investigated_systems.getColumn("hostname").editable.items =
              case_data.systems;
          }
          w2ui.main_layout.content("main", w2ui.grd_investigated_systems);
        },
        investigators: () => {
          syncAllChanges();
          w2ui.main_layout.content("main", w2ui.grd_investigators);
        },
        evidence: () => {
          syncAllChanges();
          w2ui.main_layout.content("main", w2ui.grd_evidence);
        },
        malware: () => {
          syncAllChanges();
          if (lockedByMe) {
            w2ui.grd_malware.getColumn("hostname").editable.items =
              case_data.systems;
          }
          w2ui.main_layout.content("main", w2ui.grd_malware);
        },
        accounts: () => {
          syncAllChanges();
          w2ui.main_layout.content("main", w2ui.grd_accounts);
        },
        network: () => {
          syncAllChanges();
          if (lockedByMe) {
            w2ui.grd_network.getColumn("malware").editable.items =
              case_data.malware;
          }
          w2ui.main_layout.content("main", w2ui.grd_network);
        },
        exfiltration: () => {
          syncAllChanges();
          if (lockedByMe) {
            w2ui.grd_exfiltration.getColumn("stagingsystem").editable.items =
              case_data.systems;
            w2ui.grd_exfiltration.getColumn("original").editable.items =
              case_data.systems;
            w2ui.grd_exfiltration.getColumn("exfil_to").editable.items =
              case_data.systems;
          }
          w2ui.main_layout.content("main", w2ui.grd_exfiltration);
        },
        osint: () => {
          syncAllChanges();
          w2ui.main_layout.content("main", w2ui.grd_osint);
        },
        systems: () => {
          syncAllChanges();
          w2ui.main_layout.content("main", w2ui.grd_systems);
        },
        actions: () => {
          syncAllChanges();
          if (lockedByMe) {
            w2ui.grd_actions.getColumn("owner").editable.items =
              case_data.investigators;
          }
          w2ui.main_layout.content("main", w2ui.grd_actions);
        },
        casenotes: () => {
          syncAllChanges();
          if (lockedByMe) {
            w2ui.grd_casenotes.getColumn("owner").editable.items =
              case_data.investigators;
          }
          w2ui.main_layout.content("main", w2ui.grd_casenotes);
        },
        email: () => {
          syncAllChanges();
          if (lockedByMe) {
            w2ui.grd_email.getColumn("hostname").editable.items =
              case_data.systems;
          }
          w2ui.main_layout.content("main", w2ui.grd_email);
        },
        files: () => {
          syncAllChanges();
          if (lockedByMe) {
            w2ui.grd_files.getColumn("hostname").editable.items =
              case_data.systems;
          }
          w2ui.main_layout.content("main", w2ui.grd_files);
        },
        processes: () => {
          syncAllChanges();
          if (lockedByMe) {
            w2ui.grd_processes.getColumn("hostname").editable.items =
              case_data.systems;
          }
          w2ui.main_layout.content("main", w2ui.grd_processes);
        },
        web_activity: () => {
          syncAllChanges();
          if (lockedByMe) {
            w2ui.grd_web_activity.getColumn("hostname").editable.items =
              case_data.systems;
          }
          w2ui.main_layout.content("main", w2ui.grd_web_activity);
        },
        persistence: () => {
          syncAllChanges();
          if (lockedByMe) {
            w2ui.grd_persistence.getColumn("hostname").editable.items =
              case_data.systems;
            w2ui.grd_persistence.getColumn("mitre_technique").editable.items =
              case_data.attack_techniques;
          }
          w2ui.main_layout.content("main", w2ui.grd_persistence);
        },
        threat_intel: () => {
          syncAllChanges();
          w2ui.main_layout.content("main", w2ui.grd_threat_intel);
        },
        campaigns: () => {
          syncAllChanges();
          w2ui.main_layout.content("main", w2ui.grd_campaigns);
        },
        vis_timeline: () => showTimelineView(),
        lateral: () => showLateralMovement(),
        activity: () => showActivityPlot(),
      };

      if (sidebarHandlers[event.target]) {
        sidebarHandlers[event.target]();
      } else {
        logger.warn("Unknown sidebar event target", { target: event.target });
      }
    } catch (error) {
      logger.error("Error handling sidebar click", {
        target: event.target,
        error: error.message,
      });
    }
  };

  //////////////
  // Timeline //
  //////////////

  w2ui.grd_timeline.toolbar.onClick = (event) => {
    try {
      currentgrid = w2ui.grd_timeline;
      switch (event.target) {
        case "add":
          currentgrid.add({ recid: getNextRECID(currentgrid) });
          break;

        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;

        case "import":
          show_import_dialog(w2ui.grd_timeline);
          break;

        case "export":
          export_csv(w2ui.grd_timeline);
          break;
        case "export_pdf":
          export_pdf(w2ui.grd_timeline);
          break;
        case "export_stix":
          export_stix_bundle(w2ui.grd_timeline);
          break;
        case "killchain_builder":
          showKillChainBuilder();
          break;
        default:
          logger.warn("Unknown timeline toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling timeline toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_timeline.onMenuClick = (event) => {
    try {
      if (event.menuItem.id === "duplicate") {
        w2ui.grd_timeline.save();
        const event_type = w2ui.grd_timeline.get(event.recid).event_type;
        const event_host = w2ui.grd_timeline.get(event.recid).event_host;
        const event_source_host = w2ui.grd_timeline.get(
          event.recid,
        ).event_source_host;
        const killchain = w2ui.grd_timeline.get(event.recid).killchain;
        const event_data = w2ui.grd_timeline.get(event.recid).event_data;

        w2ui.grd_timeline.add({
          recid: getNextRECID(w2ui.grd_timeline),
          event_host: event_host,
          event_type: event_type,
          event_source_host: event_source_host,
          killchain: killchain,
          event_data: event_data,
        });
      } else {
        logger.warn("Unknown timeline menu event", {
          menuId: event.menuItem.id,
        });
      }
    } catch (error) {
      logger.error("Error handling timeline menu click", {
        error: error.message,
      });
    }
  };

  //////////////////////////
  // Investigated Systems //
  //////////////////////////

  w2ui.grd_investigated_systems.toolbar.onClick = (event) => {
    try {
      currentgrid = w2ui.grd_investigated_systems;
      switch (event.target) {
        case "add":
          currentgrid.add({
            recid: getNextRECID(currentgrid),
            date_added: Date.now(),
          });
          break;
        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;

        case "import":
          show_import_dialog(w2ui.grd_investigated_systems);
          break;

        case "export":
          export_csv(w2ui.grd_investigated_systems);
          break;
        default:
          logger.warn("Unknown investigated systems toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling investigated systems toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_investigated_systems.onChange = (event) => {
    try {
      w2ui.grd_investigated_systems.records[event.index].date_updated =
        Date.now();
    } catch (error) {
      logger.error("Error handling investigated systems change", {
        error: error.message,
      });
    }
  };

  w2ui.grd_investigated_systems.onMenuClick = (event) => {
    try {
      if (event.menuItem.id === "to_tl") {
        w2ui.grd_investigated_systems.save();
        let hostname = w2ui.grd_investigated_systems.get(event.recid).hostname;
        let first_compromise = w2ui.grd_investigated_systems.get(
          event.recid,
        ).first_compromise;
        let summary = w2ui.grd_investigated_systems.get(event.recid).summary;
        w2ui.grd_timeline.add({
          recid: getNextRECID(w2ui.grd_timeline),
          event_host: hostname,
          event_data: summary,
          followup: true,
          date_time: first_compromise,
        });
        w2alert("First compromise of the system has been added to timeline.");
      } else if (event.menuItem.id === "duplicate") {
        w2ui.grd_investigated_systems.save();
        let verdict = w2ui.grd_investigated_systems.get(event.recid).verdict;
        let summary = w2ui.grd_investigated_systems.get(event.recid).summary;
        let analysis_required = w2ui.grd_investigated_systems.get(
          event.recid,
        ).analysis_required;

        w2ui.grd_investigated_systems.add({
          recid: getNextRECID(w2ui.grd_investigated_systems),
          verdict: verdict,
          summary: summary,
          analysis_required: analysis_required,
          date_added: Date.now(),
        });
      } else {
        logger.warn("Unknown investigated systems menu event", {
          menuId: event.menuItem.id,
        });
      }
    } catch (error) {
      logger.error("Error handling investigated systems menu click", {
        error: error.message,
      });
    }
  };

  /////////////
  // Malware //
  /////////////

  w2ui.grd_malware.toolbar.onClick = (event) => {
    try {
      currentgrid = w2ui.grd_malware;
      switch (event.target) {
        case "add":
          currentgrid.add({
            recid: getNextRECID(currentgrid),
            date_added: Date.now(),
          });
          break;

        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;

        case "import":
          show_import_dialog(w2ui.grd_malware);
          break;

        case "export":
          export_csv(w2ui.grd_malware);
          break;
        default:
          logger.warn("Unknown malware toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling malware toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_malware.onMenuClick = (event) => {
    try {
      let hostname, filename, filepath, md5, created, notes, summary;
      switch (event.menuItem.id) {
        case "duplicate":
          w2ui.grd_malware.save();
          hostname = w2ui.grd_malware.get(event.recid).hostname;
          filename = w2ui.grd_malware.get(event.recid).text;
          filepath = w2ui.grd_malware.get(event.recid).path_on_disk;
          md5 = w2ui.grd_malware.get(event.recid).md5;
          w2ui.grd_malware.add({
            recid: getNextRECID(w2ui.grd_malware),
            hostname: hostname,
            text: filename,
            path_on_disk: filepath,
            md5: md5,
            date_added: Date.now(),
          });

          break;

        case "to_hosts":
          w2ui.grd_malware.save();
          hostname = w2ui.grd_malware.get(event.recid).hostname;

          //check if host is there before adding

          for (const record of w2ui.grd_investigated_systems.records) {
            if (hostname == record.hostname) {
              w2alert(
                "Host already in the Investigated Hosts Tab. Can't add it twice.",
              );
              return;
            }
          }

          created = w2ui.grd_malware.get(event.recid).creation_date;
          filename = w2ui.grd_malware.get(event.recid).text;
          filepath = w2ui.grd_malware.get(event.recid).path_on_disk;
          notes = w2ui.grd_malware.get(event.recid).notes;
          summary = "Malware created (" + filepath + filename + "). " + notes;
          w2ui.grd_investigated_systems.add({
            recid: getNextRECID(w2ui.grd_investigated_systems),
            hostname: hostname,
            summary: summary,
            first_compromise: created,
            verdict: "infected",
            date_added: Date.now(),
          });
          w2alert("Host has been added to the investigated systems tab.");
          break;

        case "to_tl":
          w2ui.grd_malware.save();
          hostname = w2ui.grd_malware.get(event.recid).hostname;
          created = w2ui.grd_malware.get(event.recid).creation_date;
          filename = w2ui.grd_malware.get(event.recid).text;
          filepath = w2ui.grd_malware.get(event.recid).path_on_disk;
          notes = w2ui.grd_malware.get(event.recid).notes;
          summary = "Malware created (" + filepath + filename + "). " + notes;

          w2ui.grd_timeline.add({
            recid: getNextRECID(w2ui.grd_timeline),
            event_host: hostname,
            event_type: "Malware",
            event_data: summary,
            followup: true,
            date_time: created,
          });

          w2alert("Creation Timestamp of malware has been added to timeline.");
          break;

        case "misp":
          w2ui.grd_malware.save();
          openMispAddMalwarePopup(event.recid);
          break;

        case "vt":
          w2ui.grd_malware.save();
          check_vt(w2ui.grd_malware, event.recid);
          break;
        default:
          logger.warn("Unknown malware menu event", {
            menuId: event.menuItem.id,
          });
      }
    } catch (error) {
      logger.error("Error handling malware menu click", {
        error: error.message,
      });
    }
  };

  //////////////
  // Accounts //
  //////////////

  w2ui.grd_accounts.toolbar.onClick = (event) => {
    try {
      logger.info("Adding to accounts", { target: event.target });

      currentgrid = w2ui.grd_accounts;
      switch (event.target) {
        case "add":
          currentgrid.add({
            recid: getNextRECID(currentgrid),
            date_added: Date.now(),
          });
          break;

        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;

        case "import":
          show_import_dialog(w2ui.grd_accounts);
          break;

        case "export":
          export_csv(w2ui.grd_accounts);
          break;
        default:
          logger.warn("Unknown accounts toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling accounts toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_accounts.onMenuClick = (event) => {
    try {
      if (event.menuItem.id === "duplicate") {
        w2ui.grd_accounts.save();
        let account_name = w2ui.grd_accounts.get(event.recid).account_name;
        let domain = w2ui.grd_accounts.get(event.recid).domain;
        let context = w2ui.grd_accounts.get(event.recid).context;
        w2ui.grd_accounts.add({
          recid: getNextRECID(w2ui.grd_accounts),
          account_name: account_name,
          domain: domain,
          context: context,
          date_added: Date.now(),
        });
      } else {
        logger.warn("Unknown accounts menu event", {
          menuId: event.menuItem.id,
        });
      }
    } catch (error) {
      logger.error("Error handling accounts menu click", {
        error: error.message,
      });
    }
  };

  /////////////
  // Network //
  /////////////

  w2ui.grd_network.toolbar.onClick = (event) => {
    try {
      currentgrid = w2ui.grd_network;
      switch (event.target) {
        case "add":
          currentgrid.add({
            recid: getNextRECID(currentgrid),
            date_added: Date.now(),
          });
          break;

        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;

        case "import":
          show_import_dialog(w2ui.grd_network);
          break;

        case "export":
          export_csv(w2ui.grd_network);
          break;
        default:
          logger.warn("Unknown network toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling network toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_network.onMenuClick = (event) => {
    try {
      switch (event.menuItem.id) {
        case "misp":
          w2ui.grd_network.save();
          openMispAddNetworkPopup(event.recid);
          break;

        case "duplicate": {
          w2ui.grd_network.save();
          let ip = w2ui.grd_network.get(event.recid).ip;
          let port = w2ui.grd_network.get(event.recid).port;
          let domainname = w2ui.grd_network.get(event.recid).domainname;
          let context = w2ui.grd_network.get(event.recid).context;
          let malware = w2ui.grd_network.get(event.recid).malware;
          w2ui.grd_network.add({
            recid: getNextRECID(w2ui.grd_network),
            ip: ip,
            domainname: domainname,
            port: port,
            malware: malware,
            context: context,
            date_added: Date.now(),
          });

          break;
        }
        default:
          logger.warn("Unknown network menu event", {
            menuId: event.menuItem.id,
          });
      }
    } catch (error) {
      logger.error("Error handling network menu click", {
        error: error.message,
      });
    }
  };

  //////////////////
  // Exfiltration //
  //////////////////

  w2ui.grd_exfiltration.toolbar.onClick = (event) => {
    try {
      currentgrid = w2ui.grd_exfiltration;
      switch (event.target) {
        case "add":
          currentgrid.add({ recid: getNextRECID(currentgrid) });
          break;

        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;

        case "import":
          show_import_dialog(w2ui.grd_exfiltration);
          break;

        case "export":
          export_csv(w2ui.grd_exfiltration);
          break;
        default:
          logger.warn("Unknown exfiltration toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling exfiltration toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_exfiltration.onMenuClick = (event) => {
    try {
      switch (event.menuItem.id) {
        case "to_tl": {
          w2ui.grd_exfiltration.save();
          const source = w2ui.grd_exfiltration.get(event.recid).stagingsystem;
          const destination = w2ui.grd_exfiltration.get(event.recid).exfil_to;
          const filename = w2ui.grd_exfiltration.get(event.recid).filename;
          const time = w2ui.grd_exfiltration.get(event.recid).exfiltime;
          const exnotes = w2ui.grd_exfiltration.get(event.recid).contents || "";

          const summary = filename + " exfiltrated.";

          w2ui.grd_timeline.add({
            recid: getNextRECID(w2ui.grd_timeline),
            event_host: source,
            event_source_host: destination,
            event_data: summary,
            followup: true,
            event_type: "Exfil",
            notes: exnotes,
            direction: "",
            date_time: time,
          });

          w2alert("Exfiltration has been added to timeline.");
          break;
        }

        case "duplicate": {
          w2ui.grd_exfiltration.save();
          const created = w2ui.grd_exfiltration.get(event.recid).created;
          const exfiltime = w2ui.grd_exfiltration.get(event.recid).exfiltime;
          const stagingsystem = w2ui.grd_exfiltration.get(
            event.recid,
          ).stagingsystem;
          const original = w2ui.grd_exfiltration.get(event.recid).original;
          const exfil_to = w2ui.grd_exfiltration.get(event.recid).exfil_to;
          const filename = w2ui.grd_exfiltration.get(event.recid).filename;
          const size = w2ui.grd_exfiltration.get(event.recid).size;
          const contents = w2ui.grd_exfiltration.get(event.recid).contents;
          const context = w2ui.grd_exfiltration.get(event.recid).context;
          w2ui.grd_exfiltration.add({
            recid: getNextRECID(w2ui.grd_exfiltration),
            created: created,
            exfiltime: exfiltime,
            stagingsystem: stagingsystem,
            original: original,
            exfil_to: exfil_to,
            filename: filename,
            size: size,
            contents: contents,
            context: context,
          });
          break;
        }
        default:
          logger.warn("Unknown exfiltration menu event", {
            menuId: event.menuItem.id,
          });
      }
    } catch (error) {
      logger.error("Error handling exfiltration menu click", {
        error: error.message,
      });
    }
  };

  ///////////
  // OSInt //
  ///////////

  w2ui.grd_osint.toolbar.onClick = (event) => {
    try {
      currentgrid = w2ui.grd_osint;
      switch (event.target) {
        case "add":
          currentgrid.add({ recid: getNextRECID(currentgrid) });
          break;

        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;

        case "import":
          show_import_dialog(w2ui.grd_osint);
          break;

        case "export":
          export_csv(w2ui.grd_osint);
          break;
        default:
          logger.warn("Unknown OSINT toolbar event", { target: event.target });
      }
    } catch (error) {
      logger.error("Error handling OSINT toolbar click", {
        error: error.message,
      });
    }
  };

  /////////////
  // Systems //
  /////////////

  w2ui.grd_systems.toolbar.onClick = (event) => {
    try {
      currentgrid = w2ui.grd_systems;
      switch (event.target) {
        case "add":
          currentgrid.add({ recid: getNextRECID(currentgrid), pin: true });
          break;

        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;

        case "import":
          show_import_dialog(w2ui.grd_systems);
          break;

        case "export":
          export_csv(w2ui.grd_systems);
          break;
        default:
          logger.warn("Unknown systems toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling systems toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_systems.onChange = updateSystems;

  ///////////////////
  // Investigators //
  ///////////////////

  w2ui.grd_investigators.toolbar.onClick = (event) => {
    try {
      currentgrid = w2ui.grd_investigators;
      switch (event.target) {
        case "add":
          currentgrid.add({ recid: getNextRECID(currentgrid) });
          break;

        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;

        case "import":
          show_import_dialog(w2ui.grd_investigators);
          break;

        case "export":
          export_csv(w2ui.grd_investigators);
          break;
        default:
          logger.warn("Unknown investigators toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling investigators toolbar click", {
        error: error.message,
      });
    }
  };

  //////////////
  // Evidence //
  //////////////

  w2ui.grd_evidence.toolbar.onClick = (event) => {
    try {
      currentgrid = w2ui.grd_evidence;
      switch (event.target) {
        case "add":
          currentgrid.add({ recid: getNextRECID(currentgrid) });
          break;

        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;

        case "import":
          show_import_dialog(w2ui.grd_evidence);
          break;

        case "export":
          export_csv(w2ui.grd_evidence);
          break;
        default:
          logger.warn("Unknown evidence toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling evidence toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_evidence.onMenuClick = (event) => {
    try {
      if (event.menuItem.id === "duplicate") {
        w2ui.grd_evidence.save();
        let date_acquired = w2ui.grd_evidence.get(event.recid).date_acquired;
        let name = w2ui.grd_evidence.get(event.recid).name;
        let description = w2ui.grd_evidence.get(event.recid).description;
        let size = w2ui.grd_evidence.get(event.recid).size;
        let provider = w2ui.grd_evidence.get(event.recid).provider;
        let ev_location = w2ui.grd_evidence.get(event.recid).location;

        if (name == "undefined") name = "";

        w2ui.grd_evidence.add({
          recid: getNextRECID(w2ui.grd_evidence),
          date_acquired: date_acquired,
          name: name,
          description: description,
          size: size,
          provider: provider,
          location: ev_location,
        });
      } else {
        logger.warn("Unknown evidence menu event", {
          menuId: event.menuItem.id,
        });
      }
    } catch (error) {
      logger.error("Error handling evidence menu click", {
        error: error.message,
      });
    }
  };

  /////////////
  // Actions //
  /////////////

  w2ui.grd_actions.toolbar.onClick = (event) => {
    try {
      if (event.target === "add") {
        currentgrid.add({
          recid: getNextRECID(currentgrid),
          date_added: Date.now(),
          date_due: Date.now(),
        });
      } else if (event.target === "remove") {
        currentgrid.remove(currentgrid.getSelection());
      } else if (event.target === "import") {
        show_import_dialog(w2ui.grd_actions);
      } else if (event.target === "export") {
        export_csv(w2ui.grd_actions);
      } else {
        logger.warn("Unknown actions toolbar event", { target: event.target });
      }
    } catch (error) {
      logger.error("Error handling actions toolbar click", {
        error: error.message,
      });
    }
  };

  ////////////////
  // Case Notes //
  ////////////////

  w2ui.grd_casenotes.toolbar.onClick = (event) => {
    try {
      switch (event.target) {
        case "add":
          currentgrid.add({
            recid: getNextRECID(currentgrid),
            date_added: Date.now(),
          });
          break;

        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;

        case "import":
          show_import_dialog(w2ui.grd_casenotes);
          break;

        case "export":
          export_csv(w2ui.grd_casenotes);
          break;
        default:
          logger.warn("Unknown case notes toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling case notes toolbar click", {
        error: error.message,
      });
    }
  };

  ///////////////
  // Email Grid //
  ///////////////
  w2ui.grd_email.toolbar.onClick = (event) => {
    try {
      switch (event.target) {
        case "add":
          currentgrid.add({
            recid: getNextRECID(currentgrid),
            date_received: Date.now(),
          });
          break;
        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;
        case "import":
          show_import_dialog(w2ui.grd_email);
          break;
        case "export":
          export_csv(w2ui.grd_email);
          break;
        default:
          logger.warn("Unknown email toolbar event", { target: event.target });
      }
    } catch (error) {
      logger.error("Error handling email toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_email.onMenuClick = (event) => {
    try {
      switch (event.menuItem.id) {
        case "duplicate":
          w2ui.grd_email.save();
          duplicate_record(w2ui.grd_email, event.recid);
          break;
        case "to_tl":
          w2ui.grd_email.save();
          to_timeline(w2ui.grd_email, event.recid);
          break;
        default:
          logger.warn("Unknown email menu event", {
            menuItem: event.menuItem.id,
          });
      }
    } catch (error) {
      logger.error("Error handling email menu click", { error: error.message });
    }
  };

  //////////////////////
  // Files Grid //
  //////////////////////
  w2ui.grd_files.toolbar.onClick = (event) => {
    try {
      switch (event.target) {
        case "add":
          currentgrid.add({
            recid: getNextRECID(currentgrid),
            date_found: Date.now(),
          });
          break;
        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;
        case "import":
          show_import_dialog(w2ui.grd_files);
          break;
        case "export":
          export_csv(w2ui.grd_files);
          break;
        default:
          logger.warn("Unknown files toolbar event", { target: event.target });
      }
    } catch (error) {
      logger.error("Error handling files toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_files.onMenuClick = (event) => {
    try {
      switch (event.menuItem.id) {
        case "duplicate":
          w2ui.grd_files.save();
          duplicate_record(w2ui.grd_files, event.recid);
          break;
        case "to_tl":
          w2ui.grd_files.save();
          to_timeline(w2ui.grd_files, event.recid);
          break;
        case "vt":
          w2ui.grd_files.save();
          vtCheckFile(event.recid);
          break;
        default:
          logger.warn("Unknown files menu event", {
            menuItem: event.menuItem.id,
          });
      }
    } catch (error) {
      logger.error("Error handling files menu click", { error: error.message });
    }
  };

  //////////////////////
  // Processes Grid //
  //////////////////////
  w2ui.grd_processes.toolbar.onClick = (event) => {
    try {
      switch (event.target) {
        case "add":
          currentgrid.add({
            recid: getNextRECID(currentgrid),
            execution_time: Date.now(),
          });
          break;
        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;
        case "import":
          show_import_dialog(w2ui.grd_processes);
          break;
        case "export":
          export_csv(w2ui.grd_processes);
          break;
        default:
          logger.warn("Unknown processes toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling processes toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_processes.onMenuClick = (event) => {
    try {
      switch (event.menuItem.id) {
        case "duplicate":
          w2ui.grd_processes.save();
          duplicate_record(w2ui.grd_processes, event.recid);
          break;
        case "to_tl":
          w2ui.grd_processes.save();
          to_timeline(w2ui.grd_processes, event.recid);
          break;
        default:
          logger.warn("Unknown processes menu event", {
            menuItem: event.menuItem.id,
          });
      }
    } catch (error) {
      logger.error("Error handling processes menu click", {
        error: error.message,
      });
    }
  };

  //////////////////////////
  // Web Activity Grid //
  //////////////////////////
  w2ui.grd_web_activity.toolbar.onClick = (event) => {
    try {
      switch (event.target) {
        case "add":
          currentgrid.add({
            recid: getNextRECID(currentgrid),
            date_observed: Date.now(),
          });
          break;
        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;
        case "import":
          show_import_dialog(w2ui.grd_web_activity);
          break;
        case "export":
          export_csv(w2ui.grd_web_activity);
          break;
        default:
          logger.warn("Unknown web activity toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling web activity toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_web_activity.onMenuClick = (event) => {
    try {
      switch (event.menuItem.id) {
        case "duplicate":
          w2ui.grd_web_activity.save();
          duplicate_record(w2ui.grd_web_activity, event.recid);
          break;
        case "to_network":
          w2ui.grd_web_activity.save();
          to_network_indicators(w2ui.grd_web_activity, event.recid);
          break;
        default:
          logger.warn("Unknown web activity menu event", {
            menuItem: event.menuItem.id,
          });
      }
    } catch (error) {
      logger.error("Error handling web activity menu click", {
        error: error.message,
      });
    }
  };

  //////////////////////////
  // Persistence Grid //
  //////////////////////////
  w2ui.grd_persistence.toolbar.onClick = (event) => {
    try {
      switch (event.target) {
        case "add":
          currentgrid.add({
            recid: getNextRECID(currentgrid),
            date_discovered: Date.now(),
          });
          break;
        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;
        case "import":
          show_import_dialog(w2ui.grd_persistence);
          break;
        case "export":
          export_csv(w2ui.grd_persistence);
          break;
        default:
          logger.warn("Unknown persistence toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling persistence toolbar click", {
        error: error.message,
      });
    }
  };

  w2ui.grd_persistence.onMenuClick = (event) => {
    try {
      switch (event.menuItem.id) {
        case "duplicate":
          w2ui.grd_persistence.save();
          duplicate_record(w2ui.grd_persistence, event.recid);
          break;
        case "to_tl":
          w2ui.grd_persistence.save();
          to_timeline(w2ui.grd_persistence, event.recid);
          break;
        default:
          logger.warn("Unknown persistence menu event", {
            menuItem: event.menuItem.id,
          });
      }
    } catch (error) {
      logger.error("Error handling persistence menu click", {
        error: error.message,
      });
    }
  };

  ////////////////////////////
  // Threat Intel Grid //
  ////////////////////////////
  w2ui.grd_threat_intel.toolbar.onClick = (event) => {
    try {
      currentgrid = w2ui.grd_threat_intel;
      if (event.target === "add") {
        currentgrid.add({
          recid: getNextRECID(currentgrid),
          date_added: Date.now(),
        });
      } else if (event.target === "remove") {
        currentgrid.remove(currentgrid.getSelection());
      } else if (event.target === "import") {
        show_import_dialog(w2ui.grd_threat_intel);
      } else if (event.target === "export") {
        export_csv(w2ui.grd_threat_intel);
      } else {
        logger.warn("Unknown threat intel toolbar event", {
          target: event.target,
        });
      }
    } catch (error) {
      logger.error("Error handling threat intel toolbar click", {
        error: error.message,
      });
    }
  };

  /////////////////////
  // Campaigns Grid //
  /////////////////////
  w2ui.grd_campaigns.toolbar.onClick = (event) => {
    try {
      currentgrid = w2ui.grd_campaigns;
      switch (event.target) {
        case "add":
          currentgrid.add({ recid: getNextRECID(currentgrid) });
          break;
        case "remove":
          currentgrid.remove(currentgrid.getSelection());
          break;
        case "import":
          show_import_dialog(w2ui.grd_campaigns);
          break;
        case "export":
          export_csv(w2ui.grd_campaigns);
          break;
        default:
          logger.warn("Unknown campaigns toolbar event", {
            target: event.target,
          });
      }
    } catch (error) {
      logger.error("Error handling campaigns toolbar click", {
        error: error.message,
      });
    }
  };

  /////////////////////
  // MISP attributes //
  /////////////////////

  w2ui.grd_add_misp.toolbar.onClick = (event) => {
    try {
      currentgrid = w2ui.grd_add_misp;
      if (event.target === "send") {
        add_attributes_misp(currentgrid, currentgrid.getSelection());
      } else {
        logger.warn("Unknown MISP toolbar event", { target: event.target });
      }
    } catch (error) {
      logger.error("Error handling MISP toolbar click", {
        error: error.message,
      });
    }
  };

  ///////////////////////////////
  // Import Mapping popup grid //
  ///////////////////////////////
  w2ui.grd_import_mapping.toolbar.onClick = (event) => {
    try {
      if (event.target === "import") {
        import_data();
      } else {
        logger.warn("Unknown import mapping toolbar event", {
          target: event.target,
        });
      }
    } catch (error) {
      logger.error("Error handling import mapping toolbar click", {
        error: error.message,
      });
    }
  };

  ////////////
  // Forms //
  ///////////

  w2ui.case_form.actions.save = () => {
    try {
      case_data.case_id = w2ui.case_form.record["caseid"];
      case_data.client = w2ui.case_form.record["client"];
      case_data.start_date = w2ui.case_form.record["start_date"];
      case_data.summary = w2ui.case_form.record["summary"];
      case_data.mispserver = w2ui.case_form.record["mispserver"];
      case_data.mispapikey = w2ui.case_form.record["mispapikey"];
      case_data.mispeventid = w2ui.case_form.record["mispeventid"];
      case_data.vtapikey = w2ui.case_form.record["vtapikey"];
      w2popup.close();
      logger.info("Case form saved successfully");
    } catch (error) {
      logger.error("Error saving case form", { error: error.message });
    }
  };

  w2ui.case_form.actions.testmispconnection = () => {
    misp_connection_test().catch((error) => {
      logger.error("Error testing MISP connection", { error: error.message });
    });
  };

  w2ui.case_form.actions.testvtconnection = () => {
    vt_connection_test().catch((error) => {
      logger.error("Error testing VT connection", { error: error.message });
    });
  };
}

//////////////////////
// Helper Functions //
//////////////////////
