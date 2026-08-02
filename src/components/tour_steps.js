// Builds the full, ordered whole-app tour: sidebar, home feed, every
// bottom-nav tab, messages, profile, and (for sellers) the seller
// dashboard. Each step names a DOM target via data-tour-id and an
// "activate" function that drives the right screen into view using
// setters that screens registered through useTourRegister.
export function buildTourSteps(role, registry) {
  const r = registry.current;

  const goShell = (tab) => r.shell && r.shell(tab);
  const setSidebar = (open) => r.sidebar && r.sidebar(open);
  const goSeller = (page) => r.seller && r.seller(page);
  const goProfileSeller = (page) => r.profileSeller && r.profileSeller(page);
  const goProfileBuyer = (page) => r.profileBuyer && r.profileBuyer(page);
  const goMessages = (page) => r.messages && r.messages(page);

  const steps = [];

  // ---- HOME SCREEN ----
  steps.push({
    id: "home-menu",
    activate: () => {
      goShell("Home");
      setSidebar(false);
    },
    title: "Welcome to CodeMarket 👋",
    description: "Tap the menu icon anytime to reach Settings, Policies, and more.",
  });

  steps.push({
    id: "home-search",
    activate: () => {
      goShell("Home");
      setSidebar(false);
    },
    title: "Search services",
    description: "Type here and hit Enter to find any service instantly.",
  });

  steps.push({
    id: "home-tabs",
    activate: () => {
      goShell("Home");
      setSidebar(false);
    },
    title: "Browse categories",
    description: "Filter what you see by category — Web, App, AI, Data, and more.",
  });

  steps.push({
    id: "home-fav-0",
    activate: () => {
      goShell("Home");
      setSidebar(false);
    },
    title: "Save favorites",
    description: "Tap the heart on any listing to save it for later.",
  });

  // ---- SIDEBAR MENU ----
  steps.push({
    id: "sidebar-Settings",
    activate: () => {
      goShell("Home");
      setSidebar(true);
    },
    title: "Settings",
    description: "Manage your account preferences from here.",
  });

  steps.push({
    id: "sidebar-Privacy Policy",
    activate: () => {
      goShell("Home");
      setSidebar(true);
    },
    title: "Privacy Policy",
    description: "See how your data is handled and protected.",
  });

  steps.push({
    id: "sidebar-About",
    activate: () => {
      goShell("Home");
      setSidebar(true);
    },
    title: "About",
    description: "Learn more about CodeMarket here.",
  });

  // ---- BOTTOM NAV: Services / Favorites ----
  if (role === "seller") {
    steps.push({
      id: "Services",
      activate: () => {
        goShell("Services");
        goSeller("dashboard");
      },
      title: "Your Services tab",
      description: "This is your seller dashboard — manage everything you sell.",
    });

    steps.push({
      id: "seller-my-services",
      activate: () => {
        goShell("Services");
        goSeller("dashboard");
      },
      title: "My Services",
      description: "View and edit the services you currently offer.",
    });

    steps.push({
      id: "seller-orders",
      activate: () => {
        goShell("Services");
        goSeller("dashboard");
      },
      title: "Pending Orders",
      description: "Track orders that are waiting on you.",
    });

    steps.push({
      id: "seller-earnings",
      activate: () => {
        goShell("Services");
        goSeller("dashboard");
      },
      title: "Earnings",
      description: "Check your balance and past payouts.",
    });

    steps.push({
      id: "seller-reviews",
      activate: () => {
        goShell("Services");
        goSeller("dashboard");
      },
      title: "Reviews",
      description: "See what buyers are saying about your work.",
    });
  } else {
    steps.push({
      id: "Favorites",
      activate: () => goShell("Favorites"),
      title: "Your Favorites tab",
      description: "Every service you've saved shows up here.",
    });
  }

  // ---- BOTTOM NAV: Messages ----
  steps.push({
    id: "Messages",
    activate: () => {
      goShell("Messages");
      goMessages("messages");
    },
    title: "Messages tab",
    description: "Chat directly with buyers and sellers here.",
  });

  steps.push({
    id: "messages-search",
    activate: () => {
      goShell("Messages");
      goMessages("messages");
    },
    title: "Search chats",
    description: "Quickly find a conversation by name.",
  });

  // ---- BOTTOM NAV: Profile ----
  steps.push({
    id: "Profile",
    activate: () => {
      goShell("Profile");
      if (role === "seller") goProfileSeller("profile");
      else goProfileBuyer("profile");
    },
    title: "Profile tab",
    description: "Your account, stats, and settings all live here.",
  });

  if (role === "seller") {
    steps.push({
      id: "profile-edit",
      activate: () => {
        goShell("Profile");
        goProfileSeller("profile");
      },
      title: "Edit Profile",
      description: "Update your name, photo, and skills.",
    });

    steps.push({
      id: "profile-my-services",
      activate: () => {
        goShell("Profile");
        goProfileSeller("profile");
      },
      title: "My Services",
      description: "Add or edit the services you offer, right from your profile.",
    });

    steps.push({
      id: "profile-saved",
      activate: () => {
        goShell("Profile");
        goProfileSeller("profile");
      },
      title: "Saved Items",
      description: "Anything you've bookmarked shows up here.",
    });

    steps.push({
      id: "profile-activity",
      activate: () => {
        goShell("Profile");
        goProfileSeller("profile");
      },
      title: "Activity",
      description: "A running log of what's happened on your account.",
    });

    steps.push({
      id: "profile-settings",
      activate: () => {
        goShell("Profile");
        goProfileSeller("profile");
      },
      title: "Settings",
      description: "Notifications, dark mode, privacy, and language.",
    });
  } else {
    steps.push({
      id: "profile1-saved",
      activate: () => {
        goShell("Profile");
        goProfileBuyer("profile");
      },
      title: "Saved Items",
      description: "Anything you've bookmarked shows up here.",
    });

    steps.push({
      id: "profile1-activity",
      activate: () => {
        goShell("Profile");
        goProfileBuyer("profile");
      },
      title: "Activity",
      description: "A running log of what's happened on your account.",
    });

    steps.push({
      id: "profile1-settings",
      activate: () => {
        goShell("Profile");
        goProfileBuyer("profile");
      },
      title: "Settings",
      description: "Notifications, dark mode, privacy, and language.",
    });
  }

  // ---- WRAP UP ----
  steps.push({
    id: "Home",
    activate: () => {
      goShell("Home");
      if (role === "seller") goProfileSeller("profile");
      else goProfileBuyer("profile");
      setSidebar(false);
    },
    title: "You're all set! 🎉",
    description: "That's the full tour. Explore CodeMarket at your own pace now.",
  });

  return steps;
}
