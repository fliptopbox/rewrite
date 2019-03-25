import defer from '../../utilities/defer';

// function needs a this context
// dependancies:
// this.setState()
// this.props
// this.getUpdatedArticles()

function registerMouseEvent() {
    const html = document.querySelector('html');
    const body = document.querySelector('body');
    const sidebar = document.querySelector('#sidebar');

    const zone = [5, sidebar.offsetWidth + 50]; // mouse trigger region
    let showsidebar = body.classList.contains('show-sidebar');

    this.props.mouse(null, 'move', e => {
        const { pageX } = e;
        zone[1] = sidebar.offsetWidth + 50;
        showsidebar = body.classList.contains('show-sidebar');

        if (!showsidebar && pageX > zone[0]) {
            return;
        }

        if (pageX > zone[1]) {
            body.classList.add('sidebar-close');
            defer(
                'animate',
                () => {
                    body.classList.remove('sidebar-close');
                    body.classList.remove('show-sidebar');
                    html.classList.remove('show-alternative');
                },
                250
            );
        }

        // if (pageX < zone[0] || (showsidebar && pageX < zone[1])) {
        if (pageX < zone[0]) {
            // refresh the articles list
            this.setState({ articles: this.getUpdatedArticles() });
            body.classList.add('show-sidebar');
            defer(
                'sidebar',
                () =>
                    pageX > zone[1]
                        ? body.classList.remove('show-sidebar')
                        : null,
                500
            );
        }
    });
}

export default registerMouseEvent;
